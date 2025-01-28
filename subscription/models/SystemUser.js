const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant");
const SystemUser = sequelize.define(
  "SystemUser",
  {
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    FullName: { type: DataTypes.STRING, allowNull: false },
    MobileNumber: { type: DataTypes.STRING, allowNull: true },
    UserName: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Role: { type: DataTypes.STRING, allowNull: false },
    tenantId: {
      type: DataTypes.STRING(10), // Matches tenantId in SQL schema
      allowNull: false,
      references: {
        model: "Tenant", // Ensure this matches the tenant table's name
        key: "Id",
      },
    },
  },

  {
    schema: "subscribe",
    tableName: "SystemUser",
    timestamps: false, // Set to true if `createdAt` and `updatedAt` are present in the table
  }
);

// Association with Tenant
SystemUser.belongsTo(Tenant, { foreignKey: "tenantId", targetKey: "Id" }); // Now referencing Tenant's Id
Tenant.hasMany(SystemUser, { foreignKey: "tenantId", sourceKey: "Id" }); // Using 'Id' as the source key
module.exports = SystemUser;
