import { Inject, Injectable } from '@nestjs/common';
import {
  DIVISION_REPOSITORY,
  INSTITUTION_REPOSITORY,
  LEVEL_REPOSITORY,
} from '../../core/constants';
import { Division, Institution, Level } from './institution.model';

@Injectable()
export class InstitutionService {
  constructor(
    @Inject(INSTITUTION_REPOSITORY)
    private readonly institutionModel: typeof Institution,
    @Inject(LEVEL_REPOSITORY)
    private readonly levelModel: typeof Level,
    @Inject(DIVISION_REPOSITORY)
    private readonly divisionModel: typeof Division,
  ) {}
}
