import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './model/city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
