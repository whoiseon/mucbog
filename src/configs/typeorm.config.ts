import { TypeOrmModuleOptions } from '@nestjs/typeorm';

interface ConfigParams {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function typeORMConfig({
  host,
  port,
  username,
  password,
  database,
}: ConfigParams): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    logging: true,
  };
}
