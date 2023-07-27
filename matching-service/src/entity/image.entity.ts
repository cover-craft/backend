import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Connection } from './connection.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  image_url: string;

  @Column()
  price: number;

  @OneToMany(() => Connection, (connection) => connection.image)
  connections: Connection[];
}
