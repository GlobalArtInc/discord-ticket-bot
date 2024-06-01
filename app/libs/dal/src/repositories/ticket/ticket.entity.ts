import { BaseEntity } from '@app/dal/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('ticket')
export class TicketEntity extends BaseEntity {
  @Column('character varying', { nullable: true })
  channelId: string;

  @Column('character varying', { nullable: true })
  messageId: string;

  @Column('character varying')
  creatorId: string;

  @Column('timestamp with time zone')
  createdDate: Date;

  @Column('character varying', { nullable: true })
  closedBy: string;

  @Column('timestamp with time zone', { nullable: true })
  closedAt: Date;
}
