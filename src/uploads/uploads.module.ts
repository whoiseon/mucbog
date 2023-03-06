import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/lib/utils/multer.options';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
