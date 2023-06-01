import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Tag } from 'src/tags/entity/tag.entity';

export interface PostWithLinkedPosts extends Post {
  prevPost: Post;
  nextPost: Post;
}

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column()
  description: string;

  @Column('text')
  body: string;

  @Column('timestamptz')
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isPrivate: boolean;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail?: string;

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable({ name: 'post_tags' })
  tags: Tag[];

  @ManyToOne((type) => User, (user) => user.posts, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
