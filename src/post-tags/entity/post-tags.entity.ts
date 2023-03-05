import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { Tag } from 'src/tags/entity/tag.entity';

@Entity('posts_tags', {
  synchronize: false,
})
export class PostTags extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  postId: number;

  @Index()
  @Column()
  tagId: number;

  @ManyToOne((type) => Post, (post) => post.id, { cascade: true })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne((type) => Tag, (tag) => tag.id, { cascade: true, eager: true })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;
}
