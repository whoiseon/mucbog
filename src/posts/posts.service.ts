import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { User } from 'src/auth/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private tagsService: TagsService,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { title, body, description, tags } = createPostDto;
    const post = this.postRepository.create({
      user,
      title,
      description,
      body,
    });
    const newTags = [];
    for (const tagName of tags) {
      const tag = await this.tagsService.findOrCreate(tagName);
      newTags.push(tag);
    }
    post.tags = newTags;
    try {
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
    }

    return post;
  }
}
