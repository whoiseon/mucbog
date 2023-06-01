import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Pagination } from 'src/lib/pagination/pagination-class';

@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Public()
  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Public()
  @Get('recent')
  getDevLatestPosts(@Query('page') page = 1): Promise<Pagination<PostEntity>> {
    return this.postsService.getRecentPosts(page);
  }

  @Public()
  @Get('/tag/:tag')
  getPostsByTag(
    @Param('tag') tag: string,
    @Query('page') page = 1,
  ): Promise<Pagination<PostEntity>> {
    return this.postsService.getPostsByTag(tag, page);
  }

  @Public()
  @Get('/:title')
  getPostByTitle(@Param('title') title: string) {
    return this.postsService.getPostByTitle(title);
  }

  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  deletePost(
    @Param('id') id: number,
    @GetCurrentUser() user: User,
  ): Promise<void> {
    return this.postsService.deletePosts(id);
  }

  @Patch('/:id/update')
  @UseGuards(AccessTokenGuard)
  updatePost(
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(createPostDto, id);
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
