import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn()
  connection_id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.connections)
  portfolio: Portfolio;

  @Column()
  image_id: number;

  @Column({
    nullable: false,
  })
  request_user_id: number;

  @Column()
  pro_user_id: number;

  @Column()
  request_message: string;

  @Column({
    nullable: true,
  })
  request_review: string;

  @Column({
    nullable: false,
  })
  service_price: number;

  @Column({
    nullable: false,
  })
  total_price: number;

  @Column({
    nullable: false,
  })
  status: number; //enum about ConnectionStatus
}

export enum ConnectionStatus {
  CREATED,
  PAID,
  FINISHED,
}
