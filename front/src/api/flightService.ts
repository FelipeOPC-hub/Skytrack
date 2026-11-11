import axios from 'axios';
import { Vuelo, Avion, Tripulante } from '../types/flight';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const flightService = {
  // VUELOS
  getAll: async (): Promise<Vuelo[]> => {
    const response = await api.get<Vuelo[]>('/vuelos');
    return response.data; // El filtrado ya debería venir del backend o lo haces en el componente
  },

  getById: async (id: string): Promise<Vuelo> => {
    const response = await api.get<Vuelo>(`/vuelos/${id}`);
    return response.data;
  },

  create: async (vuelo: Partial<Vuelo>): Promise<Vuelo> => {
    const data = { ...vuelo, aerolinea: 'SkyTrack' };
    const response = await api.post<Vuelo>('/vuelos', data);
    return response.data;
  },

  update: async (id: string, vuelo: Partial<Vuelo>): Promise<Vuelo> => {
    const response = await api.patch<Vuelo>(`/vuelos/${id}`, vuelo);
    return response.data;
  },

  softDelete: async (id: string): Promise<void> => {
    // Usamos la ruta de cancelar que creamos en el backend
    await api.patch(`/vuelos/${id}/cancelar`);
  },

  // AVIONES (Caso 4) - Ajustado a /vuelos/aviones
  getAviones: async (): Promise<Avion[]> => {
    const response = await api.get<Avion[]>('/vuelos/aviones');
    return response.data;
  },

  createAvion: async (avion: Partial<Avion>): Promise<Avion> => {
    const response = await api.post<Avion>('/vuelos/aviones', avion);
    return response.data;
  },

  // TRIPULACIÓN (Caso 5) - Ajustado a /vuelos/tripulacion
  getTripulantes: async (): Promise<Tripulante[]> => {
    const response = await api.get<Tripulante[]>('/vuelos/tripulacion');
    return response.data;
  },

  createTripulante: async (tripulante: Partial<Tripulante>): Promise<Tripulante> => {
    const response = await api.post<Tripulante>('/vuelos/tripulacion', tripulante);
    return response.data;
  }
};