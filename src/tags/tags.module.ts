import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entity/tag.entity';
import { ConfigModule } from '@nestjs/config';
import { TagsController } from './tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), ConfigModule],
  providers: [TagsService],
  exports: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
