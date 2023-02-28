import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/auth/types/jwtPayload.type';
import { Tokens } from 'src/auth/types/token.type';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from 'src/auth/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  SALT_ROUNDS = 10;

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<LoginResponse> {
    const { username, password } = authCredentialsDto;
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    const user = this.userRepository.create({
      username,
      passwordHash: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('UsernameExistsError');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      payload: {
        id: user.id,
        username: user.username,
      },
      tokens,
    };
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<LoginResponse> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatched = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatched) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      payload: {
        id: user.id,
        username: user.username,
      },
      tokens,
    };
  }

  async logout(userId: number): Promise<boolean> {
    await this.userRepository.update(
      { id: userId, hashedRefreshToken: Not(IsNull()) },
      { hashedRefreshToken: null },
    );

    return true;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatched) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      this.SALT_ROUNDS,
    );
    await this.userRepository.update(userId, { hashedRefreshToken });
  }

  async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayloadType = {
      id: user.id,
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: +this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: +this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getMyInfo(user: User): Promise<JwtPayloadType> {
    return user;
  }
}
