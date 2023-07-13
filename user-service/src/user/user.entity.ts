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

  @Column({
    nullable: true,
  })
  phone_number: string;

  @Column({
    nullable: true,
  })
  profile_image_url: string;

  @Column({
    nullable: true,
  })
  category: string;

  @Column({
    nullable: true,
  })
  intro: string;
}
