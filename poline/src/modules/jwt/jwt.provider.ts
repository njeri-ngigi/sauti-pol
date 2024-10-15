import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../dto/auth.dto';
import { User } from '../user/user.model';

export type UserJWTPayload = Pick<User, 'email' | 'id'>;

@Injectable()
export class JwtProvider {
  constructor(private jwtService: JwtService) {}

  async getUserJWTPayloadFromToken(
    authHeader: string,
  ): Promise<UserJWTPayload> {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Auth token not found');
    }

    const payload = await this.jwtService.decode(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  async generateAccessToken(user: UserJWTPayload): Promise<AuthDto> {
    const payload = { email: user.email, id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
