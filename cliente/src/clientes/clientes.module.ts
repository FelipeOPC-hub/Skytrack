import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Vuelo, VueloSchema } from './schema/vuelo.schema';

@Module({
  imports: [
    // Registramos SOLO el modelo de lectura de vuelos para este módulo
    MongooseModule.forFeature([{ name: Vuelo.name, schema: VueloSchema }]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
