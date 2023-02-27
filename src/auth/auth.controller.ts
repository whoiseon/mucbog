import {
  Body,
  Controller,
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
import { User } from 'src/users/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/lib/decorators/public-decorator';
import { AccessTokenGuard } from 'src/lib/guards';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    @Req() req,
  ): Promise<LoginResponse> {
    const user = await this.authService.login(authCredentialsDto);
    req.res.setHeader('Set-Cookie', [
      `access_token=${user.tokens.access_token}`,
      `refresh_token=${user.tokens.refresh_token}`,
    ]);
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser() user: User,
  ): Promise<boolean> {
    console.log(user);
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('test')
  @UseGuards(AccessTokenGuard)
  test(@Req() req) {
    console.log('req', req);
  }
}
