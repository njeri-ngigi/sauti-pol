import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TOKEN_REPOSITORY } from '../../core/constants';
import { AuthDto } from '../dto/auth.dto';
import { User } from '../user/user.model';
import { Token } from './jwt.model';

export type UserJWTPayload = Pick<User, 'id' | 'role'>;

@Injectable()
export class JwtProvider {
  private readonly logger = new Logger(JwtProvider.name, {
    timestamp: true,
  });

  constructor(
    private jwtService: JwtService,
    @Inject(TOKEN_REPOSITORY) private readonly tokenModel: typeof Token,
  ) {}

  async verifyAccessToken(accessToken: string): Promise<UserJWTPayload> {
    try {
      this.logger.debug('Verifying token');
      return this.jwtService.verifyAsync(accessToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.logger.error('Token expired');
        throw new UnauthorizedException({
          error: 'TokenExpiredError',
          message: 'Token expired',
        });
      }

      this.logger.error('Invalid token');
      throw new UnauthorizedException({
        error: 'InvalidTokenError',
        message: 'Invalid token',
      });
    }
  }

  async getUserJWTPayloadFromToken(
    authHeader: string,
  ): Promise<UserJWTPayload> {
    const token = authHeader.split(' ')[1];
    if (!token) {
      this.logger.error('Auth token not found');
      throw new UnauthorizedException({
        error: 'MissingTokenError',
        message: 'Auth token not found',
      });
    }

    return this.verifyAccessToken(token);
  }

  async generateRefreshToken(user: UserJWTPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    // TODO: should we await this?
    this.tokenModel.create<Token>({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    this.logger.debug('Refresh token generated');

    return refreshToken;
  }

  async generateAccessToken(user: UserJWTPayload): Promise<AuthDto> {
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );

    this.logger.debug('Access token generated');

    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async verifyAndRevokeRefreshToken(
    refreshToken: string,
  ): Promise<UserJWTPayload> {
    const payload = await this.verifyAccessToken(refreshToken);
    const dbToken = await this.tokenModel.findOne<Token>({
      where: {
        token: refreshToken,
        userId: payload.id,
      },
    });

    if (!dbToken || !dbToken.isValid) {
      this.logger.error('Invalid token');
      throw new UnauthorizedException({
        error: 'InvalidTokenError',
        message: 'Invalid token',
      });
    }

    // TODO: should we await this?
    dbToken.update({ isValid: false });
    this.logger.debug('Old refresh token revoked');

    return payload;
  }
}
