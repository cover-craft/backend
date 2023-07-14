import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeORMConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOSTNAME || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_DATABASE || 'oidc',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  };
}
