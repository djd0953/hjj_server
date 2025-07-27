import { Module } from "@nestjs/common";
import { CityPriceService } from "./cityPrice.service";
import { CityModule } from "@modules/city/city.module";
import { PriceModule } from "@modules/price/price.module";
import { CityPriceController } from "./cityPrice.controller";

@Module(
{
    imports: [CityModule, PriceModule],
    providers: [CityPriceService],
    controllers: [CityPriceController]
})

export class CityPriceModule {}