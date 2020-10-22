import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstUserId: number;

  @Column()
  secondUserId: number;

  @Column('text', { array: true })
  messages: string[];
}
