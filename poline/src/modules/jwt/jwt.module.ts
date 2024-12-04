import { Module } from '@nestjs/common';
import { JwtModule as ExternalJwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { JwtProvider } from './jwt.provider';
import { tokenProviders } from './jwt.repository';

@Module({
  providers: [JwtProvider, ...tokenProviders],
  exports: [JwtProvider],
  imports: [
    ExternalJwtModule.register({
      global: true,
      secret: JWT_SECRET,
      // TODO: Verify right way to set expiresIn and how to issue a refresh token
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class JwtModule {}
