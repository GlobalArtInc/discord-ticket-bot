import { BaseRepository } from '@app/dal/base-repository';
import { ConfigEntity } from './config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ConfigRepository extends BaseRepository<ConfigEntity> {
  constructor(
    @InjectRepository(ConfigEntity)
    repository: Repository<ConfigEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
