
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the Tenant model
const Tenant = sequelize.define('Tenant', {
  Id: {
    type: DataTypes.STRING,
    primaryKey: true, // Primary key in the Tenants table
  },
  guid: { type: DataTypes.CHAR(36), allowNull: false },
  username: { type: DataTypes.STRING(50), allowNull: false },
  password: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  databaseName: { type: DataTypes.STRING(100), allowNull: false },
  UploadFolderPath: { type: DataTypes.STRING(200), allowNull: true },
  UploadUrlPath: { type: DataTypes.STRING(200), allowNull: true },
}, {
  tableName: 'Tenants',
  schema: 'subscribe',
  timestamps: false, // Disable timestamps
});

module.exports = Tenant;


