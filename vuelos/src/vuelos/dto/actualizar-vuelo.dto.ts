import { IsOptional, IsString, IsDateString, IsIn, IsArray } from 'class-validator';

export class ActualizarVueloDto {
  @IsOptional() @IsString() origen?: string;
  @IsOptional() @IsString() destino?: string;
  @IsOptional() @IsDateString() fecha?: string;
  
  @IsOptional() 
  @IsIn(['Programado','Embarcando','En vuelo','Aterrizado','Cancelado']) 
  estado?: string;

  // Ajustado solo a SkyTrack
  @IsOptional() 
  @IsIn(['SkyTrack']) 
  aerolinea?: string;

  // --- CASO 4: PODER CAMBIAR EL AVIÓN ---
  @IsOptional()
  @IsString()
  avionId?: string;

  // --- CASO 5: PODER CAMBIAR LA TRIPULACIÓN ---
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tripulacionIds?: string[];
}