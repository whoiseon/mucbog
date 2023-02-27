import { JwtPayloadType } from 'src/auth/types/jwtPayload.type';
import { Tokens } from 'src/auth/types/token.type';

export interface LoginResponse {
  payload: JwtPayloadType;
  tokens: Tokens;
}
