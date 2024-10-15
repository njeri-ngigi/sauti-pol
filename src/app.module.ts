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
// - create test factories for user

// - create divisions with parent division

// - modules to create:
//  - polling stations
//  - voter
// -
// - need to create a ui with oauth2
// - log in with google
// - create institution

// TODO:
// - create a factory for these models
// - create a 3 users: admin, clerk, regular
// - add logging
// - add tracing
