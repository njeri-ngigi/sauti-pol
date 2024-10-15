import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginValidatorMiddleware } from '../../middlewares/login.middleware';
import { SignupValidatorMiddleware } from '../../middlewares/signup.middleware';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignupValidatorMiddleware).forRoutes('auth/signup');
    consumer.apply(LoginValidatorMiddleware).forRoutes('auth/login');
  }
}
