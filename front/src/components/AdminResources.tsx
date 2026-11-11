import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../api/flightService';
import { Avion, Tripulante } from '../types/flight';
import { ArrowLeft, Save, Plane, Users, ShieldCheck, Info } from 'lucide-react';

export default function AdminResources() {
  const navigate = useNavigate();
  
  const [avion, setAvion] = useState({ modelo: '', matricula: '', estado: 'Disponible' });
  const [tripulante, setTripulante] = useState({ nombre: '', rol: 'Piloto' });
  
  const [listaAviones, setListaAviones] = useState<Avion[]>([]);
  const [listaTripulantes, setListaTripulantes] = useState<Tripulante[]>([]);
  
  const [loadingAvion, setLoadingAvion] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [avs, trips] = await Promise.all([
        flightService.getAviones(),
        flightService.getTripulantes()
      ]);
      setListaAviones(avs);
      setListaTripulantes(trips);
    } catch (error) {
      console.error("Error cargando recursos");
    }
  };

  const handleSaveAvion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avion.modelo || !avion.matricula) return alert('Complete los datos');
    try {
      setLoadingAvion(true);
      await flightService.createAvion(avion as any);
      setAvion({ modelo: '', matricula: '', estado: 'Disponible' });
      fetchData();
    } catch (error) {
      alert('Error al guardar avión');
    } finally {
      setLoadingAvion(false);
    }
  };

  const handleSaveTripulante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripulante.nombre) return alert('Ingrese el nombre');
    try {
      setLoadingTrip(true);
      await flightService.createTripulante(tripulante as any);
      setTripulante({ nombre: '', rol: 'Piloto' });
      fetchData();
    } catch (error) {
      alert('Error al guardar tripulante');
    } finally {
      setLoadingTrip(false);
    }
  };

  return (
    /* CAMBIO: Fondo sky-50 consistente */
    <div className="min-h-screen bg-sky-50 py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-xl shadow-blue-200">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Recursos <span className="text-blue-600">SkyTrack</span></h1>
              <p className="text-sky-700/60 font-medium italic">Gestión de Flota y Personal Operativo</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/vuelos')} 
            className="group flex items-center gap-2 bg-white border border-sky-100 text-sky-700 font-bold px-6 py-3.5 rounded-xl shadow-sm hover:bg-sky-50 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Volver al Panel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* SECCIÓN AVIONES */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-sky-900/5 border border-sky-100 relative overflow-hidden">
              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              
              <div className="flex items-center gap-3 mb-8 text-blue-600">
                <Plane className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-widest italic">Alta de Aeronave</h2>
              </div>

              <form onSubmit={handleSaveAvion} className="space-y-5">
                <input
                  type="text"
                  placeholder="Modelo (ej. Airbus A320)"
                  className="w-full p-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                  value={avion.modelo}
                  onChange={e => setAvion({...avion, modelo: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Matrícula (ej. LV-BRS)"
                  className="w-full p-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                  value={avion.matricula}
                  onChange={e => setAvion({...avion, matricula: e.target.value})}
                />
                <select 
                  className="w-full p-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-bold text-slate-600 appearance-none"
                  value={avion.estado}
                  onChange={e => setAvion({...avion, estado: e.target.value})}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
                <button 
                  disabled={loadingAvion}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 flex justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="w-6 h-6" /> {loadingAvion ? 'PROCESANDO...' : 'REGISTRAR EN FLOTA'}
                </button>
              </form>
            </div>

            {/* Listado de Aviones - Estilo más limpio */}
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-sky-100 shadow-sm max-h-72 overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] mb-4 px-2">Aeronaves en sistema</h3>
              <div className="space-y-3">
                {listaAviones.map(a => (
                  <div key={a._id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-sky-50 shadow-sm group hover:border-blue-200 transition-colors">
                    <span className="font-black text-slate-700 italic uppercase text-sm">
                      {a.modelo} <span className="text-blue-500 ml-2 not-italic">{a.matricula}</span>
                    </span>
                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${a.estado === 'Disponible' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {a.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECCIÓN TRIPULACIÓN */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-sky-900/5 border border-sky-100 relative overflow-hidden">
              {/* Línea decorativa superior verde */}
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

              <div className="flex items-center gap-3 mb-8 text-emerald-600">
                <Users className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-widest italic">Alta de Personal</h2>
              </div>

              <form onSubmit={handleSaveTripulante} className="space-y-5">
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  className="w-full p-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                  value={tripulante.nombre}
                  onChange={e => setTripulante({...tripulante, nombre: e.target.value})}
                />
                <select 
                  className="w-full p-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-bold text-slate-600 appearance-none"
                  value={tripulante.rol}
                  onChange={e => setTripulante({...tripulante, rol: e.target.value})}
                >
                  <option value="Piloto">Piloto</option>
                  <option value="Copiloto">Copiloto</option>
                  <option value="Comisario">Comisario</option>
                  <option value="Sobrecargo">Sobrecargo</option>
                </select>
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-700 font-bold">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <p>Personal habilitado automáticamente para operaciones SkyTrack.</p>
                </div>
                <button 
                  disabled={loadingTrip}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 flex justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="w-6 h-6" /> {loadingTrip ? 'PROCESANDO...' : 'REGISTRAR PERSONAL'}
                </button>
              </form>
            </div>

            {/* Listado de Tripulación */}
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-sky-100 shadow-sm max-h-72 overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] mb-4 px-2">Personal activo</h3>
              <div className="space-y-3">
                {listaTripulantes.map(t => (
                  <div key={t._id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-sky-50 shadow-sm group hover:border-emerald-200 transition-colors">
                    <span className="font-black text-slate-700 uppercase text-sm">{t.nombre}</span>
                    <span className="text-[9px] bg-sky-50 text-sky-600 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-sky-100">
                      {t.rol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] flex items-start md:items-center gap-6 text-sky-900/70 border border-sky-100 shadow-sm">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium leading-relaxed">
            Los recursos registrados aquí aparecerán automáticamente como opciones en el formulario de <strong className="text-blue-600 italic uppercase">Crear Nuevo Vuelo</strong>. 
            Recuerde que solo los aviones en estado <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Disponible</span> pueden ser asignados a vuelos programados.
          </p>
        </div>

      </div>
    </div>
  );
}