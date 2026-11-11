import { Controller, Get } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get('vuelos')
  async getVuelos() {
    return this.clientesService.listarVuelos();
  }
}
