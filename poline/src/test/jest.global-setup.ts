import { Test } from '@nestjs/testing';
import { SEQUELIZE } from '../core/constants';
import { DatabaseModule } from '../core/database/database.module';

module.exports = async function (globalConfig, projectConfig) {
  console.log(globalConfig.testPathPattern);
  console.log(projectConfig.cache);

  const mockModule = await Test.createTestingModule({
    imports: [DatabaseModule],
  }).compile();

  // reset the database
  await mockModule.get(SEQUELIZE).sync({ force: true });
  await mockModule.get(SEQUELIZE).close();
};
