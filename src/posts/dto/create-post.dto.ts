import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsString({ each: true })
  tags: string[];
}
