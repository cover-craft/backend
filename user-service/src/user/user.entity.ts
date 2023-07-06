import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email', 'phone_number'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  phone_number: string;

  @Column()
  profile_image: string;

  @Column()
  category: string;

  @Column()
  intro: string;
}
