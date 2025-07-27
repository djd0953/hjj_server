import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './model/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  findAll() {
    return this.itemRepo.find();
  }

  findOne(id: number) {
    return this.itemRepo.findOne({ where: { id } });
  }

  create(dto: Partial<Item>) {
    return this.itemRepo.save(dto);
  }

  async update(id: number, dto: Partial<Item>) {
    await this.itemRepo.update(id, dto);
    return this.itemRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.itemRepo.softDelete(id);
    return { success: true };
  }
}
