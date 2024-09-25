import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    InstitutionModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// TODO:
// - test the RoleGuard: different roles, no roles, invalid token, no token
// - test the jwt provider: create token, decode token, get user from token
// - test dto validation: valid, invalid
// - remove any validation covered by dto validation
// - test role middleware: different roles, no roles, invalid token, no token
// - test user service: findOneByPhone, findOneById, createUser, updateUserRole, findAll
// - test user controller: updateUserRole, getAllUsers
// - update tests for user model
// - update tests to check for RBAC - admin only tasks
