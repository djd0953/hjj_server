import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.LF_PORT ?? 4000, () => {
      console.log("Nest is running");
  });
}
bootstrap();
