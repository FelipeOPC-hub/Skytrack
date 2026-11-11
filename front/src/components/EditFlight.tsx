import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flightService } from '../api/flightService';
import { Vuelo, Pasajero, ESTADOS, AEROLINEAS } from '../types/flight';
import { ArrowLeft, Plane, UserPlus, Trash2 } from 'lucide-react';

export default function EditFlight() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<Vuelo['estado']>('Programado');
  const [aerolinea, setAerolinea] = useState<Vuelo['aerolinea']>('SkyTrack');
  const [cantidadPasajeros, setCantidadPasajeros] = useState(1);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([
    { nombre: '', pasaporte: '', email: '', telefono: '' }
  ]);

  useEffect(() => {
    if (id) {
      cargarVuelo();
    }
  }, [id]);

  const cargarVuelo = async () => {
    try {
      setLoadingData(true);
      const vuelo = await flightService.getById(id!);
      setOrigen(vuelo.origen);
      setDestino(vuelo.destino);

      // **********************************************
      // CORRECCIÓN 1: Adaptar la fecha ISO (vuelo.fecha) al formato
      // que espera el input 'datetime-local' (YYYY-MM-DDThh:mm).
      // **********************************************
      const fechaLocal = new Date(vuelo.fecha);
      const fechaFormatoInput = new Date(fechaLocal.getTime() - (fechaLocal.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);
      
      setFecha(fechaFormatoInput);

      setEstado(vuelo.estado);
      setAerolinea(vuelo.aerolinea);
      setPasajeros(vuelo.pasajeros);
      setCantidadPasajeros(vuelo.pasajeros.length);
      setError(null);
    } catch (err) {
      setError('Error al cargar el vuelo');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCantidadChange = (cantidad: number) => {
    const nuevaCantidad = Math.max(1, Math.min(300, cantidad));
    setCantidadPasajeros(nuevaCantidad);

    const nuevoPasajeros = [...pasajeros];
    if (nuevaCantidad > pasajeros.length) {
      for (let i = pasajeros.length; i < nuevaCantidad; i++) {
        nuevoPasajeros.push({ nombre: '', pasaporte: '', email: '', telefono: '' });
      }
    } else {
      nuevoPasajeros.splice(nuevaCantidad);
    }
    setPasajeros(nuevoPasajeros);
  };

  const handlePasajeroChange = (index: number, field: keyof Pasajero, value: string) => {
    const nuevosPasajeros = [...pasajeros];
    nuevosPasajeros[index] = { ...nuevosPasajeros[index], [field]: value };
    setPasajeros(nuevosPasajeros);
  };

  const eliminarPasajero = (index: number) => {
    if (pasajeros.length > 1) {
      const nuevosPasajeros = pasajeros.filter((_, i) => i !== index);
      setPasajeros(nuevosPasajeros);
      setCantidadPasajeros(nuevosPasajeros.length);
    }
  };

  const agregarPasajero = () => {
    setPasajeros([...pasajeros, { nombre: '', pasaporte: '', email: '', telefono: '' }]);
    setCantidadPasajeros(pasajeros.length + 1);
  };

  const validarFormulario = (): string | null => {
    if (!origen.trim()) return 'El origen es obligatorio';
    if (!destino.trim()) return 'El destino es obligatorio';
    if (!fecha) return 'La fecha es obligatoria';

    const fechaSeleccionada = new Date(fecha);
    const ahora = new Date();
    if (fechaSeleccionada <= ahora) {
      return 'La fecha debe ser futura';
    }

    for (let i = 0; i < pasajeros.length; i++) {
      const p = pasajeros[i];
      if (!p.nombre.trim()) return `El nombre del pasajero ${i + 1} es obligatorio`;
      if (!p.pasaporte.trim()) return `El pasaporte del pasajero ${i + 1} es obligatorio`;
      if (!p.email.trim()) return `El email del pasajero ${i + 1} es obligatorio`;
      if (!p.telefono.trim()) return `El teléfono del pasajero ${i + 1} es obligatorio`;

      if (!/\S+@\S+\.\S+/.test(p.email)) {
        return `El email del pasajero ${i + 1} no es válido`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

		// **********************************************
		// Conversión del formato de fecha local (fecha) a ISO 8601 (con Z).
		// El backend valida estrictamente los campos permitidos en PATCH.
		// **********************************************
		const fechaISO = new Date(fecha).toISOString();

		// Construimos sólo los campos permitidos por ActualizarVueloDto
		const payload: Partial<Vuelo> = {
			origen,
			destino,
			fecha: fechaISO,
			estado,
			aerolinea,
		};

		// Log para depuración: qué se enviará al backend
		console.log('PATCH payload:', payload);

		try {
			setLoading(true);
			setError(null);
			// Enviamos sólo el payload con campos permitidos para evitar 400
			await flightService.update(id!, payload);
			navigate('/vuelos');
		} catch (err: any) {
			// Mostrar mensaje del backend si existe, si no usar mensaje genérico
			const backendMessage = err?.response?.data?.message || err?.message;
			setError(backendMessage || 'Error al actualizar el vuelo. Verifica la conexión con el backend.');
			console.error('Update error:', err);
		} finally {
			setLoading(false);
		}
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-xl text-gray-700">Cargando datos del vuelo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/vuelos')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a la lista
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Editar Vuelo</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Origen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  placeholder="Ciudad de origen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destino <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="Ciudad de destino"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha y Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as Vuelo['estado'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {ESTADOS.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aerolínea <span className="text-red-500">*</span>
                </label>
                <select
                  value={aerolinea}
                  onChange={(e) => setAerolinea(e.target.value as Vuelo['aerolinea'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {AEROLINEAS.map((aero) => (
                    <option key={aero} value={aero}>{aero}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad de Pasajeros <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={cantidadPasajeros}
                  onChange={(e) => handleCantidadChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max="300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Datos de Pasajeros</h2>
                <button
                  type="button"
                  onClick={agregarPasajero}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Agregar Pasajero
                </button>
              </div>

              <div className="space-y-6">
                {pasajeros.map((pasajero, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Pasajero {index + 1}</h3>
                      {pasajeros.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarPasajero(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar pasajero"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pasajero.nombre}
                          onChange={(e) => handlePasajeroChange(index, 'nombre', e.target.value)}
                          placeholder="Nombre completo"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pasaporte <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pasajero.pasaporte}
                          onChange={(e) => handlePasajeroChange(index, 'pasaporte', e.target.value)}
                          placeholder="Número de pasaporte"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={pasajero.email}
                          onChange={(e) => handlePasajeroChange(index, 'email', e.target.value)}
                          placeholder="email@ejemplo.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={pasajero.telefono}
                          onChange={(e) => handlePasajeroChange(index, 'telefono', e.target.value)}
                          placeholder="+56 9 1234 5678"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/vuelos')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}