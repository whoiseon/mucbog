import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entity/post.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken?: string;

  @OneToMany((type) => Post, (post) => post.user, { eager: false })
  posts: Post[];
}
