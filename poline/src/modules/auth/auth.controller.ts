import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name, {
    timestamp: true,
  });

  constructor(private authService: AuthService) {}

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    this.logger.debug('Setting refresh token in cookie');
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Secure flag (ensure only sent over HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Restrict cookie to first-party context
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<Pick<AuthDto, 'accessToken'>> {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(data);

    this.setRefreshTokenCookie(res, refreshToken);

    this.logger.debug(`User ${data.email} successfully logged in`);

    return { accessToken };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() data: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Pick<AuthDto, 'accessToken'>> {
    const { accessToken, refreshToken } =
      await this.authService.signupUser(data);

    this.setRefreshTokenCookie(res, refreshToken);
    this.logger.debug(`User ${data.email} successfully signed up`);

    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Pick<AuthDto, 'accessToken'>> {
    const currentRefreshToken = req.cookies['refreshToken'];

    if (!currentRefreshToken) {
      this.logger.error('Refresh token missing');
      throw new BadRequestException({
        error: 'RefreshTokenMissingError',
        message: 'Refresh token missing',
      });
    }

    this.logger.debug(
      'Incoming request to refresh access token. Refresh token found in cookie',
    );

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(currentRefreshToken);

    this.setRefreshTokenCookie(res, refreshToken);
    this.logger.debug('Access token refreshed');

    return { accessToken };
  }
}
