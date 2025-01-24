
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  'tenant_1dc0', // Database name
  'kraftnexus', // Database user
  '3Zdoio91Hk8^cUoew', // Database password
  {
    host: '103.159.239.104',
    dialect: 'mssql',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Unable to connect to database:", error));

module.exports = {sequelize}  // Exporting directly as sequelize

