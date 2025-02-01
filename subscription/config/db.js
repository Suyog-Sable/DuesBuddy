const { Sequelize } = require("sequelize");
require("dotenv").config(); // To access the .env file

const sequelize = new Sequelize(
  process.env.DB_NAME, //'tenant_1dc0', // Database name
  process.env.DB_USER, //'kraftnexus', // Database user
  process.env.DB_PASSWORD, //"3Zdoio91Hk8^cUoew", // Database password
  {
    host: "103.159.239.104",
    dialect: "mssql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Unable to connect to database:", error));

module.exports = { sequelize }; // Exporting directly as sequelize
