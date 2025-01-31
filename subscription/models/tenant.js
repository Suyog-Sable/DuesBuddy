const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Define the Tenant model
const Tenant = sequelize.define(
  "Tenant",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Primary key in the Tenants table
      autoIncrement: true,
    },
    FullName: { type: DataTypes.STRING(50), allowNull: false },
    EmailId: { type: DataTypes.STRING(100), allowNull: false },
    MobileNo: { type: DataTypes.STRING(15), allowNull: false },
    Location: { type: DataTypes.STRING(500), allowNull: false },
    Password: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    tableName: "Tenants",
    schema: "subscribe",
    timestamps: false, // Disable timestamps
  }
);

module.exports = Tenant;
