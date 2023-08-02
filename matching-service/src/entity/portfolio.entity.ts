import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Connection } from './connection.entity';

@Entity()
@Unique(['user_id'])
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn()
  portfolio_id: number;

  @Column()
  intro_text: string;

  @Column()
  price: number;

  @Column()
  user_id: number;

  @OneToMany(() => Connection, (connection) => connection.portfolio)
  connections: Connection[];
}
