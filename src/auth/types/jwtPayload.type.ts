export type JwtPayloadType = {
  id: number;
  username: string;
};

export type JwtPayloadWithRefreshToken = JwtPayloadType & {
  refreshToken: string;
};
