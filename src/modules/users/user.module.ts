import { Module } from '@nestjs/common';
import { userProviders } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
