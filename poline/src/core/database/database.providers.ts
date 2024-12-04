import { Sequelize } from 'sequelize-typescript';
import {
  Division,
  Institution,
  Level,
} from '../../modules/institution/institution.model';
import { Token } from '../../modules/jwt/jwt.model';
import { User } from '../../modules/user/user.model';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Token, Institution, Level, Division]);

      // For the test environment, we forcefully clear the database
      // before running tests in the jest.global-setup.ts file
      if (process.env.NODE_ENV !== TEST) {
        await sequelize.sync({});
      }

      return sequelize;
    },
  },
];
