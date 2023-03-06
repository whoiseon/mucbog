import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entity/tag.entity';
import { Repository } from 'typeorm';
import { groupBy } from 'rxjs';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findOrCreate(tagName: string): Promise<Tag> {
    const lowerCaseTagName = tagName.toLowerCase();
    const tag = await this.tagRepository.findOneBy({
      name: lowerCaseTagName,
    });

    try {
      if (tag) {
        return tag;
      } else {
        const newTag = this.tagRepository.create({
          name: lowerCaseTagName,
        });
        await this.tagRepository.save(newTag);

        return newTag;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTags() {
    const tagWithPostCounts = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.posts', 'post')
      .select(['tag.id', 'tag.name', 'COUNT(post.id) AS post_count'])
      .groupBy('tag.id, tag.name')
      .getRawMany();

    return tagWithPostCounts;
  }
}
