import { TOKEN_REPOSITORY } from '../../core/constants';
import { Token } from './jwt.model';

export const tokenProviders = [{ provide: TOKEN_REPOSITORY, useValue: Token }];
