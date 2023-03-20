import {
  Body,
  Controller,
  Delete,
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
  @Get('dev/recent')
  getDevLatestPosts(@Query('page') page = 1): Promise<Pagination<PostEntity>> {
    return this.postsService.getRecentPosts(1, page);
  }

  @Public()
  @Get('project/recent')
  getProjectLatestPosts(
    @Query('page') page = 1,
  ): Promise<Pagination<PostEntity>> {
    return this.postsService.getRecentPosts(2, page);
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

  @Post()
  @UseGuards(AccessTokenGuard)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, user);
  }
}
