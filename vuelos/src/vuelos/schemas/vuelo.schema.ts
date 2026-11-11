import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Pasajero {
  @Prop({ required: true }) nombre: string;
  @Prop({ required: true }) pasaporte: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) telefono: string;
}
export const PasajeroSchema = SchemaFactory.createForClass(Pasajero);

// --- NUEVOS SCHEMAS PARA RECURSOS ---

@Schema()
export class Avion extends Document {
  @Prop({ required: true }) modelo: string;
  @Prop({ required: true, unique: true }) matricula: string;
  @Prop({ required: true, enum: ['Disponible', 'En vuelo', 'Mantenimiento'], default: 'Disponible' }) estado: string;
}
export const AvionSchema = SchemaFactory.createForClass(Avion);

@Schema()
export class Tripulante extends Document {
  @Prop({ required: true }) nombre: string;
  @Prop({ required: true, enum: ['Piloto', 'Copiloto', 'Comisario', 'Sobrecargo'] }) rol: string;
}
export const TripulanteSchema = SchemaFactory.createForClass(Tripulante);

// --- SCHEMA PRINCIPAL DE VUELO ---

@Schema({ timestamps: true })
export class Vuelo extends Document {
  @Prop({ required: true }) origen: string;
  @Prop({ required: true }) destino: string;
  @Prop({ required: true }) fecha: Date;
  
  @Prop({ required: true, enum: ['Programado','Embarcando','En vuelo','Aterrizado','Cancelado'], default: 'Programado' }) 
  estado: string;

  @Prop({ required: true, enum: ['SkyTrack'], default: 'SkyTrack' }) 
  aerolinea: string;

  @Prop({ type: [PasajeroSchema], required: true }) 
  pasajeros: Pasajero[];

  @Prop({ default: true }) 
  activo: boolean;

  // Caso 4: Relación con Avión
  @Prop({ type: String, ref: 'Avion', required: false }) 
  avionId?: string; 

  // Caso 5: Relación con Tripulación (Array de IDs)
  @Prop({ type: [String], ref: 'Tripulante', default: [] }) 
  tripulacionIds: string[];
}
export const VueloSchema = SchemaFactory.createForClass(Vuelo);