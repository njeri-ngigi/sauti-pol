import { Module } from '@nestjs/common';
import { JwtModule as ExternalJwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { JwtProvider } from './jwt.provider';

@Module({
  providers: [JwtProvider],
  exports: [JwtProvider],
  imports: [
    ExternalJwtModule.register({
      global: true,
      secret: JWT_SECRET,
      // TODO: Verify right way to set expiresIn and how to issue a refresh token
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class JwtModule {}
