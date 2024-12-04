import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtProvider } from '../jwt/jwt.provider';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });

  constructor(
    private userService: UserService,
    private jwtService: JwtProvider,
  ) {}

  async loginUser(user: LoginDto): Promise<AuthDto> {
    const dbUser = await this.userService.findOneByEmailOrPhone({
      email: user.email,
    });

    if (!dbUser) {
      this.logger.error(`User ${user.email} not found`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      dbUser.password,
    );

    if (!isPasswordValid) {
      this.logger.error(`Invalid password`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.debug(`User ${user.email} added to database`);
    return this.jwtService.generateAccessToken(dbUser);
  }

  async signupUser(user: SignupDto): Promise<AuthDto> {
    const dbUser = await this.userService.createUser(user);
    this.logger.debug(`User ${user.email} added to database`);
    return this.jwtService.generateAccessToken(dbUser);
  }

  async refreshToken(refreshToken: string): Promise<AuthDto> {
    const { id } =
      await this.jwtService.verifyAndRevokeRefreshToken(refreshToken);
    const dbUser = await this.userService.findOneById(id);
    return this.jwtService.generateAccessToken(dbUser);
  }
}
