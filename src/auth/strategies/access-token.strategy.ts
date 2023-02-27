import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtPayloadType } from 'src/auth/types/jwtPayload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadType) {
    const { username } = payload;
    const user: User = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
