import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from 'src/uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/lib/guards';

@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('thumbnail')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadThumbnail(@UploadedFile() file: Express.MulterS3.File) {
    const extension = file.originalname.split('.').pop();
    return this.uploadsService.uploadImage(
      file,
      `posts/thumbnails/${decodeURIComponent(
        file.originalname,
      )}_${Date.now()}.${extension}`,
    );
  }
}
