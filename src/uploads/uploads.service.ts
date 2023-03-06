import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: configService.get('AWS_BUCKET_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadImage(file: Express.MulterS3.File, key: string) {
    if (!file) {
      throw new BadRequestException('Not found file');
    }

    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }
}
