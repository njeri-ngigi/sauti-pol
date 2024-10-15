import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() data: LoginDto): Promise<AuthDto> {
    return this.authService.loginUser(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() data: SignupDto): Promise<AuthDto> {
    return this.authService.signupUser(data);
  }
}
