import {
  DIVISION_REPOSITORY,
  INSTITUTION_REPOSITORY,
  LEVEL_REPOSITORY,
} from '../../core/constants';
import { Division, Institution, Level } from './institutions.model';

export const institutionProviders = [
  { provide: INSTITUTION_REPOSITORY, useValue: Institution },
  { provide: LEVEL_REPOSITORY, useValue: Level },
  { provide: DIVISION_REPOSITORY, useValue: Division },
];
