import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from 'src/posts/entity/post.entity';

@Entity()
@Unique(['name'])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 255 })
  name: string;

  @ManyToMany((type) => Post, (post) => post.tags)
  posts: Post[];
}
