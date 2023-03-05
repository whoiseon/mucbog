import { Module } from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTags } from 'src/post-tags/entity/post-tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostTags])],
  providers: [PostTagsService],
})
export class PostTagsModule {}
