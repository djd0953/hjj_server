import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CityService } from '@modules/city/city.service';
import { PriceService } from '@modules/price/price.service';

@Injectable()
export class CityPriceService {
    constructor(
		@Inject(CityService) private readonly cityService: CityService,
		@Inject(PriceService) private readonly priceService: PriceService,
		private readonly dataSource: DataSource,

      ) {}

	async getList() {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try 
		{
			const citys = await this.cityService.findAll();
			const prices = await this.priceService.getPriceStats();

			const retVal = []
			for (const p of prices)
			{
				let p2: {id: number, name: string, price: {id: number, max: number, min: number, avg: number}[]} | undefined = retVal.find(x => x.id === p.city_id)
				if (!p2)
				{
					const c = citys.find(x => x.id === p.city_id)
					if (!c) continue;

					p2 = {
						id: c.id,
						name: c.name,
						price: []
					}

					retVal.push(p2)
				}

				p2.price[p.item_id] = {
					id: p.item_id,
					max: p.max_price,
					min: p.min_price,
					avg: p.avg_price
				}
			}

			await queryRunner.commitTransaction();

			return retVal;
		}
		catch (e: any) 
		{
			await queryRunner.rollbackTransaction();
		  	return { success: false, message: e?.message || '' };
		} 
		finally 
		{
			await queryRunner.release();
		}
	}
}
