import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { TagsModule } from 'src/tags/tags.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Post]),
    TagsModule,
    CategoriesModule,
    AuthModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
