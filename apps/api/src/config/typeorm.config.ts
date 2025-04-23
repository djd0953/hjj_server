import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'localhost',
  password: process.env.MYSQL_PASS || '1234',
  database: process.env.MYSQL_DB || 'test',
  entities: [__dirname + '/../modules/**/*.entity.ts'],
  synchronize: true, // Set to false in production
};
