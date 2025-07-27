import { Controller, Get } from '@nestjs/common';
import { CityPriceService } from './cityPrice.service';

@Controller('/cityPrice')
export class CityPriceController {
  constructor(private readonly cityPriceService: CityPriceService) {}

  @Get()
  async list() {
    return this.cityPriceService.getList()
  }
}
