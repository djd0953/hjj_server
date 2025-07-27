import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

require('dotenv').config();

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 4000);
    console.log('start');
};

bootstrap();
