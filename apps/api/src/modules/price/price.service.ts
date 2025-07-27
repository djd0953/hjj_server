import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './model/price.entity';
import { City } from '@modules/city/model/city.entity';

interface CreatePriceDto {
    city_id: number;
    item_id: number;
    price: number;
}

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepo: Repository<Price>,
  ) {}

  async getPriceStats() {
	return this.priceRepo
		.createQueryBuilder('price')
		.leftJoin('price.item', 'item')
		.select('price.city_id', 'city_id')
		.addSelect('price.item_id', 'item_id')
		.addSelect('item.name', 'item_name')
		.addSelect('MAX(price.price)', 'max_price')
		.addSelect('MIN(price.price)', 'min_price')
		.addSelect('AVG(price.price)', 'avg_price')
		.groupBy('price.city_id')
		.addGroupBy('price.item_id')
		.addGroupBy('item.name')
		.getRawMany();
  }

  async createPrices(prices: CreatePriceDto[]) {
        // DTO에서 엔티티로 매핑
        const priceEntities = prices.map(dto => {
            const price = new Price();
            price.city = { id: dto.city_id } as any;  // id만 할당 (관계형)
            price.item = { id: dto.item_id } as any;
            price.price = dto.price;
            return price;
        });

        // bulk insert
        return this.priceRepo.save(priceEntities);
    }

  findAll() {
    return this.priceRepo.find();
  }

  findOne(id: number) {
    return this.priceRepo.findOne({ where: { id } });
  }

  create(dto: Partial<Price>) {
    return this.priceRepo.save(dto);
  }

  async update(id: number, dto: Partial<Price>) {
    await this.priceRepo.update(id, dto);
    return this.priceRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.priceRepo.softDelete(id);
    return { success: true };
  }
}
