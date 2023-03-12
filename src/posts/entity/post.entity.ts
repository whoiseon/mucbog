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
import { Category } from 'src/categories/entity/category.entity';

export interface LinkedPosts {
  prevPost: string;
  nextPost: string;
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

  @ManyToOne((type) => Category, (category) => category.posts)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable({ name: 'post_tags' })
  tags: Tag[];

  @ManyToOne((type) => User, (user) => user.posts, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
