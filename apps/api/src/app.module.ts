import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mySqlConfig } from '@config/typeorm.config';
// import { UserModule } from '@modules/user/user.module';
// import { LoginHistoryModule } from '@modules/login_history/login_history.module';
import { CityModule } from '@modules/city/city.module';
import { ItemModule } from '@modules/item/item.module';
import { PriceModule } from '@modules/price/price.module';
import { CityPriceModule } from '@modules/cityPrice/cityPrice.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = new mySqlConfig('postgres');
        return config.createTypeOrmOptions();
      },
    }),
    // UserModule,
    // LoginHistoryModule
    CityModule,
    ItemModule,
    PriceModule,
    CityPriceModule
  ],
})
export class AppModule {}
