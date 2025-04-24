import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
  console.log('start');
};

bootstrap();
