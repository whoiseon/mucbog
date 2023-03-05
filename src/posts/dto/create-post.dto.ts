import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  tags: string[];
}
