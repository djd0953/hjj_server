import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mySqlConfig } from '@config/typeorm.config';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = new mySqlConfig('postgres');
        return config.createTypeOrmOptions();
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
