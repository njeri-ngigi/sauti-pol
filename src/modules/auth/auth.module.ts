import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginValidatorMiddleware } from '../../middlewares/login.middleware';
import { SignupValidatorMiddleware } from '../../middlewares/signup.middleware';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_SECRET } from './constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      // TODO: Verify right way to set expiresIn and how to issue a refresh token
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignupValidatorMiddleware).forRoutes('auth/signup');
    consumer.apply(LoginValidatorMiddleware).forRoutes('auth/login');
  }
}
