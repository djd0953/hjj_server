import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PriceService } from './price.service';

interface CreatePriceDto {
    city_id: number;
    item_id: number;
    price: number;
}

@Controller('price')
export class PriceController {
	constructor(private readonly priceService: PriceService) {}

	@Get()
	getAll() {
		return this.priceService.findAll();
	}

	@Get('stats')
	getStats()
	{
		return this.priceService.getPriceStats();
	}

	@Get(':id')
	getOne(@Param('id') id: number) {
		return this.priceService.findOne(id);
	}

	@Post('bulkCreate')
	async createPrices(@Body() prices: CreatePriceDto[])
	{
		return this.priceService.createPrices(prices)
	}

	@Delete(':id')
	delete(@Param('id') id: number) {
		return this.priceService.delete(id);
	}
}
