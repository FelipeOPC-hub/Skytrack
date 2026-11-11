import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VuelosService } from './vuelos.service';
import { CrearVueloDto } from './dto/crear-vuelo.dto';
import { ActualizarVueloDto } from './dto/actualizar-vuelo.dto';

@Controller('vuelos')
export class VuelosController {
  constructor(private readonly service: VuelosService) {}

  @Post()
  crear(@Body() dto: CrearVueloDto) {
    return this.service.crearVuelo(dto);
  }

  @Get()
  listar(@Query() filtros: any) {
    return this.service.listarVuelos(filtros);
  }

  @Get('aviones')
  listarAviones() {
    return this.service.listarAviones();
  }

  @Post('aviones')
  crearAvion(@Body() dto: any) {
    return this.service.crearAvion(dto);
  }

  @Get('tripulacion')
  listarTripulantes() {
    return this.service.listarTripulantes();
  }

  @Post('tripulacion')
  crearTripulante(@Body() dto: any) {
    return this.service.crearTripulante(dto);
  }

  @Get(':id')
  detalle(@Param('id') id: string) {
    return this.service.detalleVuelo(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarVueloDto) {
    return this.service.actualizarVuelo(id, dto);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.service.cancelarVuelo(id);
  }
}