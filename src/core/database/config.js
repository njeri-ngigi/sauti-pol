// This file is used to load the database configuration from the database.config.ts file
// Why? The database.config.ts file is a TypeScript file, and the Sequelize CLI does not support TypeScript files.
// Used in .sequelizerc file to load the database configuration
require('ts-node/register');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./database.config.ts');
module.exports = config.databaseConfig;
