import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(user: User): Promise<AuthDto> {
    const payload = { email: user.email, id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

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

    return this.generateAccessToken(dbUser);
  }

  async signupUser(user: SignupDto): Promise<AuthDto> {
    const dbUser = await this.userService.createUser(user);
    return this.generateAccessToken(dbUser);
  }
}
