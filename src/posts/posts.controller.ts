import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { Post as PostEntity } from 'src/posts/entity/post.entity';
import { GetCurrentUser } from 'src/lib/decorators';
import { User } from 'src/auth/entity/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { AccessTokenGuard } from 'src/lib/guards';
import { TagsService } from 'src/tags/tags.service';
import { Public } from 'src/lib/decorators/public-decorator';

@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Public()
  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Public()
  @Get('dev/recent')
  getDevLatestPosts(): Promise<PostEntity[]> {
    return this.postsService.getRecentPosts(1);
  }

  @Public()
  @Get('project/recent')
  getProjectLatestPosts(): Promise<PostEntity[]> {
    return this.postsService.getRecentPosts(2);
  }

  @Public()
  @Get('/tag/:tag')
  getPostsByTag(@Param('tag') tag: string): Promise<PostEntity[]> {
    return this.postsService.getPostsByTag(tag);
  }

  @Public()
  @Get('/:title')
  getPostByTitle(@Param('title') title: string) {
    return this.postsService.getPostByTitle(title);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, user);
  }
}
