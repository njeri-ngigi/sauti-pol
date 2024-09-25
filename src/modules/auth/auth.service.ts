import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtProvider } from '../jwt/jwt.provider';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtProvider,
  ) {}

  async loginUser(user: LoginDto): Promise<AuthDto> {
    const dbUser = await this.userService.findOneByEmail(user.email);
    if (!dbUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      dbUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return await this.jwtService.generateAccessToken(dbUser);
  }

  async signupUser(user: SignupDto): Promise<AuthDto> {
    const dbUser = await this.userService.createUser(user);
    return await this.jwtService.generateAccessToken(dbUser);
  }
}
