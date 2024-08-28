import { Test } from '@nestjs/testing';
import { SEQUELIZE } from '../core/constants';
import { databaseProviders } from '../core/database/database.providers';
import { UserModule } from '../modules/users/user.module';
import { userProviders } from '../modules/users/user.provider';
import { UserService } from '../modules/users/user.service';

module.exports = async function (globalConfig, projectConfig) {
  console.log(globalConfig.testPathPattern);
  console.log(projectConfig.cache);

  const mockModule = await Test.createTestingModule({
    imports: [UserModule],
    providers: [UserService, ...databaseProviders, ...userProviders],
  }).compile();

  // reset the database
  await mockModule.get(SEQUELIZE).sync({ force: true });
  await mockModule.get(SEQUELIZE).close();
};
