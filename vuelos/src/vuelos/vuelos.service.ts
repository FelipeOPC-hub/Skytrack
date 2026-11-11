import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';  
import { Vuelo, Avion, Tripulante } from './schemas/vuelo.schema'; 
import { CrearVueloDto } from './dto/crear-vuelo.dto';
import { ActualizarVueloDto } from './dto/actualizar-vuelo.dto';  

@Injectable()
export class VuelosService {
  constructor(
    @InjectModel(Vuelo.name) private vueloModel: Model<Vuelo>,
    @InjectModel(Avion.name) private avionModel: Model<Avion>, 
    @InjectModel(Tripulante.name) private tripulanteModel: Model<Tripulante> 
  ) {}

  private ensureFutureDate(fechaIso: string) {
    const fecha = new Date(fechaIso);
    if (isNaN(fecha.getTime()) || fecha <= new Date()) {
      throw new BadRequestException('La fecha debe ser futura y válida');
    }
    return fecha;
  }

  async listarAviones() {
    return this.avionModel.find().lean();
  }

  async crearAvion(dto: any) {
    return this.avionModel.create(dto);
  }

  async listarTripulantes() {
    return this.tripulanteModel.find().lean();
  }

  async crearTripulante(dto: any) {
    return this.tripulanteModel.create(dto);
  }

  async crearVuelo(dto: CrearVueloDto): Promise<any> {
    const fecha = this.ensureFutureDate(dto.fecha);

    const pasaportes = dto.pasajeros.map(p => p.pasaporte);
    const duplicadosEnPayload = pasaportes.filter((p, i) => pasaportes.indexOf(p) !== i);
    if (duplicadosEnPayload.length) {
      throw new BadRequestException(`Pasaportes duplicados: ${Array.from(new Set(duplicadosEnPayload)).join(', ')}`);
    }

    const existentes = await this.vueloModel.find({
      'pasajeros.pasaporte': { $in: pasaportes },
      activo: true,
    }).select('pasajeros.pasaporte').lean();

    if (existentes.length) {
      const usados = Array.from(new Set(
        existentes.flatMap(v => v.pasajeros.map(p => p.pasaporte)).filter(p => pasaportes.includes(p))
      ));
      throw new BadRequestException(`Pasaportes ya registrados: ${usados.join(', ')}`);
    }

    const vuelo = await this.vueloModel.create({ ...dto, fecha });
    return { ...vuelo.toObject(), id: vuelo._id.toString() };
  }

  async listarVuelos(filtros: any): Promise<any[]> {
    const query: any = { activo: true };
    if (filtros.origen) query.origen = filtros.origen;
    if (filtros.destino) query.destino = filtros.destino;
    if (filtros.estado) query.estado = filtros.estado;

    const vuelos = await this.vueloModel.find(query)
      .populate('avionId') 
      .sort({ fecha: 1 })
      .lean();
      
    return vuelos.map(v => ({ ...v, id: v._id.toString() }));
  }

  async detalleVuelo(id: string): Promise<any> {
    const vuelo = await this.vueloModel.findById(id).populate('avionId').lean();
    if (!vuelo) throw new NotFoundException('Vuelo no encontrado');
    return { ...vuelo, id: vuelo._id.toString() };
  }

  async actualizarVuelo(id: string, dto: ActualizarVueloDto): Promise<any> {
    const payload: any = { ...dto };
    if (dto.fecha) payload.fecha = this.ensureFutureDate(dto.fecha);

    const updated = await this.vueloModel
      .findByIdAndUpdate(id, payload, { new: true })
      .populate('avionId')
      .lean();

    if (!updated) throw new NotFoundException('Vuelo no encontrado');
    return { ...updated, id: updated._id.toString() };
  }

  async cancelarVuelo(id: string): Promise<any> {
    const updated = await this.vueloModel.findByIdAndUpdate(id, { activo: false }, { new: true }).lean();
    if (!updated) throw new NotFoundException('Vuelo no encontrado');
    return { ...updated, id: updated._id.toString() };
  }
}