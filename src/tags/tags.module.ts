import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entity/tag.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), ConfigModule],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
