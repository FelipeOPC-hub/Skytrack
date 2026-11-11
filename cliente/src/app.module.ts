import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/skytrack'),
    ClientesModule, // ✅ SOLO clientes por ahora
  ],
})
export class AppModule {}
