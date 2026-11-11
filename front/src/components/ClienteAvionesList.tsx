import { useEffect, useState } from "react";
import { clientesService } from "../api/clientesService";
import { Plane, Calendar, MapPin, Clock, Tag, AlertCircle, Info } from "lucide-react";

interface VueloCliente {
  id: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  aerolinea?: string;
}

export default function ClienteAvionesList() {
  const [vuelos, setVuelos] = useState<VueloCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarVuelos();
  }, []);

  const cargarVuelos = async () => {
    try {
      setLoading(true);
      const res = await clientesService.getVuelos();
      setVuelos(res.data);
      setError(null);
    } catch (err) {
      setError("No pudimos recuperar tu itinerario en este momento.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return {
      dia: fecha.toLocaleDateString("es-AR", { day: '2-digit', month: 'long' }),
      hora: fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' }),
      week: fecha.toLocaleDateString("es-AR", { weekday: 'long' })
    };
  };

  const getEstadoStyles = (estado: string) => {
    const styles: Record<string, string> = {
      Programado: "bg-blue-50 text-blue-600 border-blue-100",
      Embarcando: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
      "En vuelo": "bg-sky-500 text-white border-sky-500",
      Aterrizado: "bg-emerald-50 text-emerald-600 border-emerald-100",
      Cancelado: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return styles[estado] || "bg-slate-50 text-slate-500 border-slate-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Plane className="w-12 h-12 text-blue-600 animate-bounce" />
            <div className="absolute -bottom-2 w-12 h-1.5 bg-blue-900/10 rounded-full blur-sm animate-pulse"></div>
          </div>
          <p className="mt-6 text-sky-900/40 font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Itinerario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Estilo Premium */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-600 font-black tracking-[0.2em] text-[10px] uppercase">Passenger Portal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Mis <span className="text-blue-600">Viajes</span></h1>
          <p className="text-sky-900/40 font-bold text-sm mt-1">Gestiona tus próximos destinos y estados de vuelo.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm">
            <AlertCircle className="text-rose-500 w-5 h-5" />
            <p className="text-rose-700 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Grid de Tickets */}
        <div className="grid gap-8">
          {vuelos.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-xl shadow-sky-900/5 border border-sky-100">
              <div className="bg-sky-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-sky-100">
                <Plane className="w-10 h-10 text-sky-200 -rotate-45" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 italic">¿A dónde vamos hoy?</h3>
              <p className="text-sky-900/40 mt-2 font-medium">Todavía no tienes vuelos programados en tu cuenta.</p>
            </div>
          ) : (
            vuelos.map((vuelo) => {
              const f = formatFecha(vuelo.fecha);
              return (
                <div key={vuelo.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-900/10 hover:shadow-blue-900/10 transition-all duration-500 border border-sky-100">
                  
                  <div className="flex flex-col md:flex-row">
                    {/* Cuerpo Principal del Ticket */}
                    <div className="flex-1 p-10">
                      <div className="flex justify-between items-start mb-10">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getEstadoStyles(vuelo.estado)}`}>
                          {vuelo.estado}
                        </span>
                        <div className="flex items-center gap-2 text-sky-900/30">
                          <Tag className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{vuelo.aerolinea || "SkyTrack"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 mb-10">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 italic">Origen</p>
                          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{vuelo.origen.substring(0, 3)}</h2>
                          <p className="text-xs font-bold text-sky-900/40 mt-1 uppercase">{vuelo.origen}</p>
                        </div>

                        <div className="flex flex-col items-center flex-1 px-4">
                          <div className="w-full flex items-center gap-4">
                            <div className="h-[2px] flex-1 bg-sky-100"></div>
                            <div className="p-2 bg-sky-50 rounded-full border border-sky-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                              <Plane className="w-5 h-5 rotate-90" />
                            </div>
                            <div className="h-[2px] flex-1 bg-sky-100"></div>
                          </div>
                          <span className="text-[9px] font-black text-sky-200 mt-3 uppercase tracking-[0.3em]">Direct Flight</span>
                        </div>

                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 italic">Destino</p>
                          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{vuelo.destino.substring(0, 3)}</h2>
                          <p className="text-xs font-bold text-sky-900/40 mt-1 uppercase">{vuelo.destino}</p>
                        </div>
                      </div>

                      {/* Detalles inferiores */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-sky-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-blue-600 border border-sky-100">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-sky-900/30 uppercase tracking-widest">Fecha</p>
                            <p className="text-sm font-black text-slate-700 capitalize">{f.dia}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-blue-600 border border-sky-100">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-sky-900/30 uppercase tracking-widest">Embarque</p>
                            <p className="text-sm font-black text-slate-700 uppercase">{f.hora} HS</p>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-blue-600 border border-sky-100">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-sky-900/30 uppercase tracking-widest">Terminal</p>
                            <p className="text-sm font-black text-slate-700 uppercase">Internacional B</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lado Derecho - El Stub lateral */}
                    <div className="bg-sky-50/50 border-l border-dashed border-sky-200 w-full md:w-40 flex md:flex-col items-center justify-center p-8 gap-6 relative">
                      <div className="md:rotate-90 whitespace-nowrap">
                        <p className="text-[10px] font-black text-sky-900/20 uppercase tracking-[0.5em]">Boarding Pass</p>
                      </div>
                      <div className="w-20 h-20 bg-white p-3 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center justify-center gap-1 group-hover:border-blue-200 transition-colors">
                        <div className="grid grid-cols-3 gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          {[...Array(9)].map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-[2px] ${i % 2 === 0 ? 'bg-slate-900' : 'bg-blue-600'}`}></div>
                          ))}
                        </div>
                        <span className="text-[7px] font-black text-slate-400 mt-2">SKY-2025</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-4 w-8 h-8 bg-sky-50 rounded-full -translate-y-1/2 border border-sky-100"></div>
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-sky-50 rounded-full -translate-y-1/2 border border-sky-100"></div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-16 bg-white/50 p-6 rounded-[2rem] border border-sky-100 flex items-center gap-4 justify-center">
           <Info className="w-5 h-5 text-blue-500" />
           <p className="text-sky-900/40 text-[10px] font-black uppercase tracking-[0.2em]">
             Presente su pasaporte digital 2 horas antes de la salida programada.
           </p>
        </div>
      </div>
    </div>
  );
}