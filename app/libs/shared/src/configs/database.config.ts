import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TicketEntity } from '@app/dal/repositories';
import { MIGRATIONS } from 'migrations';
import { ConfigEntity } from '@app/dal/repositories/config';

export const databaseCredentials = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const entities = [TicketEntity, ConfigEntity];

export const defaultDatabaseConfig = {
  type: 'postgres',
  logging: ['error'],
  synchronize: false,
  schema: 'public',
  entities,
  migrations: [...MIGRATIONS],
  migrationsTableName: 'migration',
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export default registerAs('database', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
