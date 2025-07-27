import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './model/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  findAll() {
    return this.cityRepo.find();
  }

  findOne(id: number) {
    return this.cityRepo.findOne({ where: { id } });
  }

  create(dto: Partial<City>) {
    return this.cityRepo.save(dto);
  }

  async update(id: number, dto: Partial<City>) {
    await this.cityRepo.update(id, dto);
    return this.cityRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.cityRepo.softDelete(id);
    return { success: true };
  }
}
