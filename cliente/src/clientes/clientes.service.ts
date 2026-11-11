import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vuelo, VueloDocument } from './schema/vuelo.schema';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Vuelo.name) private readonly vueloModel: Model<VueloDocument>,
  ) {}

  async listarVuelos(): Promise<
    Array<{
      id: string;
      origen: string;
      destino: string;
      fecha: Date;
      estado: string;
      aerolinea: string; // 👈 nuevo campo
    }>
  > {
    const vuelos = await this.vueloModel.find({}).lean();

    return vuelos.map((v: any) => ({
      id: v._id?.toString(),
      origen: v.origen,
      destino: v.destino,
      fecha: v.fecha,
      estado: v.estado,
      aerolinea: v.aerolinea ?? 'SkyTrack', // 👈 usa el campo si existe, o valor por defecto
    }));
  }
}
