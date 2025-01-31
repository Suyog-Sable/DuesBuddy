const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant");

const Attendance = sequelize.define(
  "Attendance",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.INTEGER, // Matches tenantId in SQL schema
      allowNull: false,
      references: {
        model: "Tenant", // Ensure this matches the tenant table's name
        key: "Id",
      },
    },
    UserId: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
    },
    CheckIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CheckOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CheckInBy: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    CheckInDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CheckOutBy: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    CheckOutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Attendance",
    schema: "subscribe",
    timestamps: false,
  }
);

// Association with Tenant
Attendance.belongsTo(Tenant, { foreignKey: "tenantId", targetKey: "Id" }); // Now referencing Tenant's Id
Tenant.hasMany(Attendance, { foreignKey: "tenantId", sourceKey: "Id" }); // Using 'Id' as the source key

// Define associations for foreign keys
Attendance.associate = (models) => {
  Attendance.belongsTo(models.User, {
    foreignKey: "UserId",
    as: "User",
  });
  // Attendance.belongsTo(models.SystemUser, {
  //   foreignKey: "CheckInBy",
  //   as: "CheckInByUser",
  // });
  // Attendance.belongsTo(models.SystemUser, {
  //   foreignKey: "CheckOutBy",
  //   as: "CheckOutByUser",
  // });
};
module.exports = Attendance;
