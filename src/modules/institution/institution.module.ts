import { Module } from '@nestjs/common';
import { InstitutionController } from './institution.controller';
import { institutionProviders } from './institution.repository';
import { InstitutionService } from './institution.service';

@Module({
  providers: [InstitutionService, ...institutionProviders],
  controllers: [InstitutionController],
})
export class InstitutionModule {}
