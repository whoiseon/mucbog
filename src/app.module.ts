import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/lib/guards';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { PostTagsModule } from './post-tags/post-tags.module';
import { UploadsModule } from './uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({ dest: 'posts/' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      typeORMConfig({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      }),
    ),
    AuthModule,
    PostsModule,
    TagsModule,
    PostTagsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
