import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InstitutionMiddleware } from '../../middlewares/institution.middleware';
import { UserModule } from '../user/user.module';
import { InstitutionController } from './institution.controller';
import { institutionProviders } from './institution.repository';
import { InstitutionService } from './institution.service';

@Module({
  providers: [InstitutionService, ...institutionProviders],
  controllers: [InstitutionController],
  imports: [UserModule],
})
export class InstitutionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InstitutionMiddleware).forRoutes('institutions');
  }
}
