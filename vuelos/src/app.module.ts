import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VuelosModule } from './vuelos/vuelos.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/skytrack'),
    VuelosModule,
  ],
})
export class AppModule {}

