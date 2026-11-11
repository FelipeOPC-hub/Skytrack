import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const clientesService = {
  getVuelos: () => axios.get(`${API_URL}/clientes/vuelos`),
};
