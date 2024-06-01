import { BaseRepository } from '@app/dal/base-repository';
import { TicketEntity } from './ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TicketRepository extends BaseRepository<TicketEntity> {
  constructor(
    @InjectRepository(TicketEntity)
    repository: Repository<TicketEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
