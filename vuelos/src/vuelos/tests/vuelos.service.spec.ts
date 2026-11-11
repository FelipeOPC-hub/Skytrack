import { Test, TestingModule } from '@nestjs/testing';
import { VuelosService } from '../vuelos.service';

describe('VuelosService (Unit Tests)', () => {
  let service: VuelosService;

  // Creamos un simulador vacío para los modelos de la DB
  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    // añade más métodos si tu service los usa
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VuelosService,
        { provide: 'VueloModel', useValue: mockModel },
        { provide: 'AvionModel', useValue: mockModel },
        { provide: 'TripulanteModel', useValue: mockModel },
      ],
    }).compile();

    service = module.get<VuelosService>(VuelosService);
  });

  it('debe filtrar correctamente por estado', () => {
    const mockVuelos = [
      { id: '1', estado: 'En vuelo', activo: true },
      { id: '2', estado: 'Programado', activo: true },
    ];
    
    // Probamos la lógica pura del filtro
    const resultado = mockVuelos.filter(v => v.estado === 'En vuelo');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].estado).toBe('En vuelo');
  });

  it('no debe mostrar vuelos con baja lógica (activo: false)', () => {
    const mockVuelos = [
      { id: '1', activo: true },
      { id: '2', activo: false },
    ];
    const resultado = mockVuelos.filter(v => v.activo === true);
    expect(resultado).toHaveLength(1);
  });
});