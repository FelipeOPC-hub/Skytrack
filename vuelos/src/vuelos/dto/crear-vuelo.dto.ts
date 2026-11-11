import { 
  IsString, 
  IsDateString, 
  IsArray, 
  ValidateNested, 
  IsEmail, 
  IsIn, 
  ArrayMinSize, 
  IsBoolean,
  IsOptional,
  IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';

class PasajeroDto {
  @IsString() nombre: string;
  @IsString() pasaporte: string;
  @IsEmail() email: string;
  @IsString() telefono: string;
}

export class CrearVueloDto {
  @IsString() 
  origen: string;

  @IsString() 
  destino: string;

  @IsDateString() 
  fecha: string; 

  @IsIn(['Programado', 'Embarcando', 'En vuelo', 'Aterrizado', 'Cancelado'])
  estado: string;

  // Ajustado solo a SkyTrack según requerimiento
  @IsIn(['SkyTrack'])
  aerolinea: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PasajeroDto)
  pasajeros: PasajeroDto[];

  @IsBoolean()
  activo: boolean;

  // --- CASO 4: ASIGNACIÓN DE AVIÓN ---
  @IsOptional()
  @IsString()
  avionId?: string;

  // --- CASO 5: ASIGNACIÓN DE TRIPULACIÓN ---
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tripulacionIds?: string[];
}