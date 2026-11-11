import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'vuelos' }) // usa la colección existente 'vuelos'
export class Vuelo {
  // Si querés que Mongoose te dé el _id, no lo declares aquí; lo obtenés del document
  @Prop({ required: true }) origen: string;
  @Prop({ required: true }) destino: string;
  @Prop({ required: true }) fecha: Date;
  @Prop({ required: true }) estado: string;

  // Opcionales, por si existen en tu colección
  @Prop() avionId?: string;
  @Prop({ type: [String], default: [] }) tripulacionIds?: string[];
}

export type VueloDocument = Vuelo & Document;
export const VueloSchema = SchemaFactory.createForClass(Vuelo);
