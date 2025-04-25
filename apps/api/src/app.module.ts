import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mySqlConfig } from '@config/typeorm.config';
import { UserModule } from '@modules/user/user.module';
import { LoginHistoryModule } from '@modules/login_history/login_history.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = new mySqlConfig('postgres');
        return config.createTypeOrmOptions();
      },
    }),
    UserModule,
    LoginHistoryModule
  ],
})
export class AppModule {}
