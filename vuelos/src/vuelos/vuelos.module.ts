import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VuelosController } from './vuelos.controller';
import { VuelosService } from './vuelos.service';
import { 
  Vuelo, VueloSchema, 
  Avion, AvionSchema, 
  Tripulante, TripulanteSchema 
} from './schemas/vuelo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vuelo.name, schema: VueloSchema },
      { name: Avion.name, schema: AvionSchema }, 
      { name: Tripulante.name, schema: TripulanteSchema }, 
    ]),
  ],
  controllers: [VuelosController],
  providers: [VuelosService],
  exports: [VuelosService],
})
export class VuelosModule {}