import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Post]),
    TagsModule,
    AuthModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
