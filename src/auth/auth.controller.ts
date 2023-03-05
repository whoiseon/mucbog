import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { LoginResponse } from 'src/auth/types';
import { GetCurrentUser, GetCurrentUserId } from 'src/lib/decorators';
import { Tokens } from 'src/auth/types/token.type';
import { User } from 'src/auth/entity/user.entity';
import { Public } from 'src/lib/decorators/public-decorator';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/lib/guards';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<LoginResponse> {
    return this.authService.register(authCredentialsDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Req() req: Request,
  ): Promise<LoginResponse> {
    const user = await this.authService.login(authCredentialsDto);
    req.res.cookie('access_token', user.tokens.access_token, {
      domain: 'localhost',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: false,
    });
    req.res.cookie('refresh_token', user.tokens.refresh_token, {
      domain: 'localhost',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: false,
    });
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser() user: User,
    @Req() req: Request,
  ): Promise<boolean> {
    req.res.clearCookie('access_token');
    req.res.clearCookie('refresh_token');
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  test(@GetCurrentUser() user: User) {
    return this.authService.getMyInfo(user);
  }
}
