import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entity/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findOrCreate(tagName: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ name: tagName });
    try {
      if (tag) {
        return tag;
      } else {
        const newTag = this.tagRepository.create({ name: tagName });
        await this.tagRepository.save(newTag);

        return newTag;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
