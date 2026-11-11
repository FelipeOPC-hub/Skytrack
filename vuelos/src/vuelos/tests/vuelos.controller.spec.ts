import { Test, TestingModule } from '@nestjs/testing';
import { VuelosController } from '../vuelos.controller';
import { VuelosService } from '../vuelos.service';

describe('VuelosController', () => {
  let controller: VuelosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VuelosController],
      providers: [
        // Simulamos el service para que el controlador no pida la DB
        {
          provide: VuelosService,
          useValue: { getVuelos: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<VuelosController>(VuelosController);
  });

  it('el controlador debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});