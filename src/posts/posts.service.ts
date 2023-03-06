import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { User } from 'src/auth/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private tagsService: TagsService,
    private categoryService: CategoriesService,
  ) {}

  async getRecentPosts(categoryId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['user', 'tags'],
      select: [
        'id',
        'title',
        'description',
        'body',
        'thumbnail',
        'createdAt',
        'user',
        'tags',
      ],
      where: [{ isPrivate: true, category: { id: categoryId } }],
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });

    return posts;
  }

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { title, body, description, tags, thumbnail, categoryId } =
      createPostDto;
    const category = await this.categoryService.getCategories(categoryId);
    const post = this.postRepository.create({
      user,
      title,
      description,
      body,
      thumbnail,
      category,
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
