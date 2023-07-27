import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn()
  connection_id: number;

  @ManyToOne(() => Image, (image) => image.connections)
  image: Image;

  @Column({
    nullable: false,
  })
  request_user_id: number;

  @Column()
  pro_user_id: number;

  @Column()
  request_message: string;

  @Column()
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
