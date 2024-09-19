import { Module } from '@nestjs/common';
import { InstitutionsController } from './institutions.controller';
import { institutionProviders } from './institutions.repository';
import { InstitutionsService } from './institutions.service';

@Module({
  providers: [InstitutionsService, ...institutionProviders],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
