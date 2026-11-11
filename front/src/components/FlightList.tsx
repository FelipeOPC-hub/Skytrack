import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../api/flightService';
import { Vuelo } from '../types/flight';
import { Plane, Plus, Edit, Trash2, Users, Search } from 'lucide-react';

export default function FlightList() {
  const navigate = useNavigate();
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [filtroDestino, setFiltroDestino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarVuelos();
  }, []);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'C') {
        e.preventDefault();
        window.open('/clientes/vuelos', '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const cargarVuelos = async () => {
    try {
      setLoading(true);
      const data = await flightService.getAll();
      const lista = Array.isArray(data) ? data : [];
      const soloSkyTrack = lista.filter(v => v.aerolinea === 'SkyTrack');
      setVuelos(soloSkyTrack);
    } catch (err) {
      console.error("Error cargando vuelos:", err);
      setVuelos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Desea realizar la baja lógica de este vuelo?')) {
      try {
        await flightService.softDelete(id);
        cargarVuelos(); 
      } catch (err) {
        alert('Error al eliminar el vuelo.');
      }
    }
  };

  const vuelosFiltrados = vuelos.filter((vuelo) => {
    const matchOrigen = (vuelo.origen || '').toLowerCase().includes(filtroOrigen.toLowerCase());
    const matchDestino = (vuelo.destino || '').toLowerCase().includes(filtroDestino.toLowerCase());
    const matchEstado = filtroEstado === '' || vuelo.estado === filtroEstado;
    return matchOrigen && matchDestino && matchEstado;
  });

  const formatFecha = (fecha: string) => {
    try {
      const d = new Date(fecha);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Fecha pendiente';
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      'Programado': 'bg-blue-50 text-blue-600 border-blue-100',
      'Embarcando': 'bg-amber-50 text-amber-600 border-amber-100',
      'En vuelo': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Aterrizado': 'bg-slate-50 text-slate-600 border-slate-100',
      'Cancelado': 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return colors[estado] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  if (loading) {
    return (
      /* CAMBIO: Fondo celeste en carga */
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 text-blue-600 animate-pulse mx-auto" />
          <p className="mt-4 text-sky-600/60 font-black uppercase tracking-widest text-[10px]">Cargando SkyTrack...</p>
        </div>
      </div>
    );
  }

  return (
    /* CAMBIO: Fondo principal bg-sky-50 */
    <div className="min-h-screen bg-sky-50 py-10 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-xl shadow-blue-200">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">SkyTrack <span className="text-blue-600 underline decoration-sky-300 underline-offset-8">Airlines</span></h1>
              <p className="text-sky-700/60 mt-1 font-medium italic">Internal Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/recursos')} className="px-6 py-3.5 bg-white border border-sky-100 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-sky-50 transition-all font-bold shadow-sm">
              <Users className="w-5 h-5 text-blue-600" /> Recursos
            </button>
            <button onClick={() => navigate('/crear-vuelo')} className="px-6 py-3.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200">
              <Plus className="w-5 h-5" /> Nuevo Vuelo
            </button>
          </div>
        </div>

        {/* Filtros: Ahora con bordes sky-100 para que se fundan mejor */}
        <div className="bg-white rounded-[2rem] border border-sky-100 shadow-xl shadow-sky-900/5 p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-sky-900/70 ml-1">Origen</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-sky-300" />
                <input type="text" value={filtroOrigen} onChange={(e) => setFiltroOrigen(e.target.value)} placeholder="Ej: Madrid" className="w-full pl-12 pr-4 py-3.5 bg-sky-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sky-900/70 ml-1">Destino</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-sky-300" />
                <input type="text" value={filtroDestino} onChange={(e) => setFiltroDestino(e.target.value)} placeholder="Ej: New York" className="w-full pl-12 pr-4 py-3.5 bg-sky-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sky-900/70 ml-1">Estado Operativo</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full px-4 py-3.5 bg-sky-50/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-600 cursor-pointer appearance-none">
                <option value="">Todos los vuelos</option>
                {['Programado', 'Embarcando', 'En vuelo', 'Aterrizado', 'Cancelado'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla principal: Bordes en sky-100 */}
        <div className="bg-white rounded-[2rem] border border-sky-100 shadow-2xl shadow-sky-900/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sky-50/50 border-b border-sky-100 text-[11px] font-black text-sky-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5 text-left">Trayecto</th>
                  <th className="px-8 py-5 text-left">Itinerario</th>
                  <th className="px-8 py-5 text-left">Estado</th>
                  <th className="px-8 py-5 text-left">Ocupación</th>
                  <th className="px-8 py-5 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {vuelosFiltrados.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-sky-300 font-black uppercase text-xs tracking-widest">Sin datos registrados</td></tr>
                ) : (
                  vuelosFiltrados.map((vuelo) => (
                    <tr key={vuelo.id} className="hover:bg-sky-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 font-black text-slate-800 uppercase italic">
                          {vuelo.origen} <Plane className="w-4 h-4 text-sky-200 rotate-90" /> {vuelo.destino}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">{formatFecha(vuelo.fecha)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getEstadoColor(vuelo.estado)}`}>
                          {vuelo.estado}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-700">{(vuelo.pasajeros?.length || 0)} PAX</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/editar-vuelo/${vuelo.id}`)} className="p-2.5 bg-white border border-sky-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(vuelo.id!)} className="p-2.5 bg-white border border-sky-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-30" disabled={!vuelo.activo}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}