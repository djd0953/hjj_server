import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class mySqlConfig {
    type: 'mysql' | 'postgres';

    constructor(type: 'mysql' | 'postgres') {
        this.type = type;
    }
    createTypeOrmOptions(): TypeOrmModuleOptions {
        if (this.type === 'mysql') {
            return {
                type: 'mysql',
                host: process.env.LF_MYSQL_HOST || 'localhost',
                port: Number(process.env.LF_MYSQL_PORT) || 3306,
                username: process.env.LF_MYSQL_USER || 'localhost',
                password: process.env.LF_MYSQL_PASS || '1234',
                database: process.env.LF_MYSQL_DB || 'test',
                entities: [__dirname + '/../modules/**/*.entity.ts'],
                synchronize: true,
            };
        } else if (this.type === 'postgres') {
            return {
                type: 'postgres',
                host: process.env.LF_POSTGRES_HOST || 'localhost',
                port: Number(process.env.LF_POSTGRES_PORT) || 5432,
                username: process.env.LF_POSTGRES_USER || 'localhost',
                password: process.env.LF_POSTGRES_PASS || '1234',
                database: process.env.LF_POSTGRES_DB || 'postgres',
                entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
                synchronize: false,
                // ssl: {
                //     rejectUnauthorized: false,
                // },
            };
        } else {
            return {
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'localhost',
                password: '1234',
                database: 'test',
                entities: [__dirname + '/../modules/**/*.entity.ts'],
                synchronize: true,
            };
        }
    }
}
