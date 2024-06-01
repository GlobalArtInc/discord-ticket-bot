import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('config')
export class ConfigEntity {
  @PrimaryColumn('character varying', { name: 'key' })
  id: string;

  @Column('text')
  value: string;
}
