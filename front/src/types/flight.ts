export interface Pasajero {
  nombre: string;
  pasaporte: string;
  email: string;
  telefono: string;
}

export interface Tripulante {
  id?: string;
  _id?: string;
  nombre: string;
  rol: 'Piloto' | 'Copiloto' | 'Comisario' | 'Sobrecargo';
}

export interface Avion {
  id?: string;
  _id?: string;
  modelo: string;
  matricula: string;
  estado: 'Disponible' | 'En vuelo' | 'Mantenimiento';
}

export const ESTADOS = [
  'Programado',
  'Embarcando',
  'En vuelo',
  'Aterrizado',
  'Cancelado',
] as const;

export const AEROLINEAS = ['SkyTrack'] as const;

export type EstadoVuelo = typeof ESTADOS[number];
export type Aerolinea = typeof AEROLINEAS[number];

export interface Vuelo {
  id?: string;
  _id?: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: EstadoVuelo;
  aerolinea: Aerolinea;
  pasajeros: Pasajero[];
  avionId?: string;
  tripulacionIds?: string[];
  activo: boolean;
}

export type VueloDTO = Omit<Vuelo, 'id' | '_id'>;