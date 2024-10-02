import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { RoleMiddleware } from '../../middlewares/role.middleware';
import { JwtModule } from '../jwt/jwt.module';
import { UserController } from './user.controller';
import { userProviders } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, ...userProviders],
  exports: [UserService],
  controllers: [UserController],
  imports: [DatabaseModule, JwtModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoleMiddleware).forRoutes('users/:id/role');
  }
}
