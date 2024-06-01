import { TicketEntity, TicketRepository } from '@app/dal/repositories';
import { ConfigEntity, ConfigRepository } from '@app/dal/repositories/config';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const DAL_ENTITIES = [TicketEntity, ConfigEntity];
const DAL_MODELS = [TicketRepository, ConfigRepository];
const DAL_PROVIDERS = [ConfigService];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(DAL_ENTITIES)],
  providers: [...DAL_MODELS, ...DAL_PROVIDERS],
  exports: [TypeOrmModule.forFeature(DAL_ENTITIES), ...DAL_MODELS, ...DAL_PROVIDERS],
})
export class SharedModule {}
