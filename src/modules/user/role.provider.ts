import { ROLE_REPOSITORY } from '../../core/constants';

export const Roles = {
  ADMIN: 'admin',
  CLERK: 'clerk',
  USER: 'user',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const roleProviders = [{ provide: ROLE_REPOSITORY, useValue: Roles }];
