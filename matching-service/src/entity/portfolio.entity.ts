import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
@Unique(['user_id'])
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn()
  portfolio_id: number;

  @Column()
  intro_text: string;

  @Column()
  user_id: number;

  @ManyToMany(() => Image)
  @JoinTable()
  images: Image[];
}
