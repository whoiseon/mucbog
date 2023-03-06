import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/lib/decorators/public-decorator';
import { TagsService } from 'src/tags/tags.service';

@Controller('api/tags')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Public()
  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }
}
