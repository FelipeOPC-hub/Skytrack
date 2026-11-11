import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../api/flightService';
import { Vuelo, Pasajero, ESTADOS, Avion, Tripulante } from '../types/flight';
import { ArrowLeft, Plane, UserPlus, Trash2, Calendar, MapPin, ShieldCheck, Info } from 'lucide-react';

export default function CreateFlight() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [avionesDisponibles, setAvionesDisponibles] = useState<Avion[]>([]);
  const [tripulacionDisponible, setTripulacionDisponible] = useState<Tripulante[]>([]);

  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<Vuelo['estado']>('Programado');
  const [avionId, setAvionId] = useState('');
  const [tripulacionIds, setTripulacionIds] = useState<string[]>([]);
  
  const aerolinea = 'SkyTrack' as const; 
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([
    { nombre: '', pasaporte: '', email: '', telefono: '' }
  ]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [aviones, tripulantes] = await Promise.all([
          flightService.getAviones(), 
          flightService.getTripulantes()
        ]);
        setAvionesDisponibles(aviones.filter(a => a.estado === 'Disponible'));
        setTripulacionDisponible(tripulantes);
      } catch (err) {
        console.error("Error cargando recursos", err);
      }
    };
    fetchResources();
  }, []);

  const handlePasajeroChange = (index: number, field: keyof Pasajero, value: string) => {
    const nuevosPasajeros = [...pasajeros];
    nuevosPasajeros[index] = { ...nuevosPasajeros[index], [field]: value };
    setPasajeros(nuevosPasajeros);
  };

  const eliminarPasajero = (index: number) => {
    if (pasajeros.length > 1) {
      setPasajeros(pasajeros.filter((_, i) => i !== index));
    }
  };

  const agregarPasajero = () => {
    setPasajeros([...pasajeros, { nombre: '', pasaporte: '', email: '', telefono: '' }]);
  };

  const handleTripulacionToggle = (id: string) => {
    setTripulacionIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!avionId) return setError('Debe seleccionar un avión para el trayecto');
    if (tripulacionIds.length === 0) return setError('La normativa exige al menos un tripulante asignado');

    const vuelo: Vuelo = {
      origen,
      destino,
      fecha: new Date(fecha).toISOString(), 
      estado,
      aerolinea,
      pasajeros,
      avionId,
      tripulacionIds,
      activo: true,
    };

    try {
      setLoading(true);
      await flightService.create(vuelo);
      navigate('/vuelos');
    } catch (err) {
      setError('Hubo un problema al registrar el vuelo en el sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* CAMBIO: bg-sky-50 (Fondo Celestito) */
    <div className="min-h-screen bg-sky-50 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/vuelos')} 
          /* CAMBIO: text-sky-700 para que combine */
          className="group flex items-center gap-2 mb-8 text-sky-700 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Volver al Panel
        </button>

        {/* Tarjeta Principal: border-sky-100 y sombra con tinte azul */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(14,165,233,0.1)] overflow-hidden border border-sky-100">
          
          <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-sky-400 font-black tracking-[0.2em] text-xs uppercase">SkyTrack Operations</span>
              </div>
              <h1 className="text-3xl font-black italic">Programar Nuevo Vuelo</h1>
              <p className="text-slate-400 mt-2 font-medium">Panel de configuración logística de aeronaves.</p>
            </div>
            {/* El resplandor azul de fondo se mantiene porque queda genial */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          <div className="p-10">
            {error && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold flex items-center gap-3 rounded-2xl">
                <div className="bg-rose-500 p-1 rounded-lg text-white">
                  <Info className="w-4 h-4" />
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* SECCIÓN 1: ITINERARIO - bg-sky-50/50 */}
              <section className="bg-sky-50/50 p-8 rounded-[2rem] border border-sky-100/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">01</div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-sky-900 italic">Itinerario de Vuelo</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-sky-300 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                    <input 
                      type="text" 
                      placeholder="Ciudad de Origen" 
                      className="w-full pl-12 pr-4 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all outline-none"
                      value={origen} onChange={e => setOrigen(e.target.value)} required 
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-sky-300 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                    <input 
                      type="text" 
                      placeholder="Ciudad de Destino" 
                      className="w-full pl-12 pr-4 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all outline-none"
                      value={destino} onChange={e => setDestino(e.target.value)} required 
                    />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-4 text-sky-300 w-5 h-5" />
                    <input 
                      type="datetime-local" 
                      className="w-full pl-12 pr-4 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all outline-none"
                      value={fecha} onChange={e => setFecha(e.target.value)} required 
                    />
                  </div>
                  <select 
                    className="w-full px-6 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 appearance-none cursor-pointer outline-none"
                    value={estado} onChange={e => setEstado(e.target.value as any)}
                  >
                    {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
                  </select>
                </div>
              </section>

              {/* SECCIÓN 2: RECURSOS */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-sky-50/50 p-8 rounded-[2rem] border border-sky-100/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">02</div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-sky-900 italic">Aeronave</h2>
                  </div>
                  <select 
                    className="w-full px-6 py-4 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all cursor-pointer outline-none"
                    value={avionId} onChange={e => setAvionId(e.target.value)} required
                  >
                    <option value="">Seleccionar Avión...</option>
                    {avionesDisponibles.map(a => (
                      <option key={a.id || a._id} value={a.id || a._id}>{a.modelo} — {a.matricula}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-sky-50/50 p-8 rounded-[2rem] border border-sky-100/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">03</div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-sky-900 italic">Tripulación</h2>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {tripulacionDisponible.map(t => (
                      <label 
                        key={t.id || t._id} 
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${tripulacionIds.includes((t.id || t._id)!) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-sky-100 text-sky-900/60 hover:border-blue-300 shadow-sm'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="hidden" checked={tripulacionIds.includes((t.id || t._id)!)} onChange={() => handleTripulacionToggle((t.id || t._id)!)} />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight leading-tight">{t.nombre}</span>
                            <span className={`text-[10px] font-bold ${tripulacionIds.includes((t.id || t._id)!) ? 'text-blue-100' : 'text-sky-300'}`}>{t.rol}</span>
                          </div>
                        </div>
                        {tripulacionIds.includes((t.id || t._id)!) && <ShieldCheck className="w-5 h-5 text-white" />}
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECCIÓN 3: MANIFIESTO (Se mantiene el fondo oscuro para contraste de impacto) */}
              <section className="bg-slate-900 -mx-10 p-10 mt-12 border-y border-sky-500/20">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">04</div>
                      <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Manifiesto de Pasajeros</h2>
                    </div>
                    <button 
                      type="button" 
                      onClick={agregarPasajero} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black shadow-lg transition-all active:scale-95"
                    >
                      <UserPlus className="w-4 h-4" /> AGREGAR PASAJERO
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {pasajeros.map((p, i) => (
                      <div key={i} className="group grid grid-cols-1 md:grid-cols-[1fr,1fr,1.5fr,auto] gap-5 p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400/50 uppercase ml-1">Nombre</label>
                          <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold p-3.5 text-white focus:border-blue-500 outline-none transition-all" value={p.nombre} onChange={e => handlePasajeroChange(i, 'nombre', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400/50 uppercase ml-1">Pasaporte</label>
                          <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold p-3.5 text-white focus:border-blue-500 outline-none transition-all" value={p.pasaporte} onChange={e => handlePasajeroChange(i, 'pasaporte', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400/50 uppercase ml-1">E-mail</label>
                          <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold p-3.5 text-white focus:border-blue-500 outline-none transition-all" value={p.email} onChange={e => handlePasajeroChange(i, 'email', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400/50 uppercase ml-1">Telefono</label>
                          <input type="telefono" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold p-3.5 text-white focus:border-blue-500 outline-none transition-all" value={p.telefono} onChange={e => handlePasajeroChange(i, 'telefono', e.target.value)} required />
                        </div>
                        <div className="flex items-end pb-1">
                          <button 
                            type="button" 
                            onClick={() => eliminarPasajero(i)} 
                            className="p-3.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Botón Final */}
              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-sky-200 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck className="w-6 h-6" />
                      Sincronizar Operación de Vuelo
                    </>
                  )}
                </button>
                <p className="text-center text-sky-900/30 text-[10px] mt-8 font-black uppercase tracking-[0.3em]">
                  SkyTrack Air Security • Protocol v2.5
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}