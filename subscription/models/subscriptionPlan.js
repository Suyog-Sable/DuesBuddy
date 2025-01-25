const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Tenant = require('./tenant'); // Import Tenant model

const SubscriptionPlan = sequelize.define(
  'SubscriptionPlan',
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Amount: {
      type: DataTypes.INTEGER, // Matches the SQL table definition
      allowNull: true,         // Align with the table's nullable field
    },
    Days: {
      type: DataTypes.INTEGER,
      allowNull: true,         // Align with the table's nullable field
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,       // Matches DEFAULT ((1)) in SQL
    },
    Shortcode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Sessions: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tenantId: {
      type: DataTypes.STRING(10), // Matches tenantId in SQL schema
      allowNull: false,
      references: {
        model: 'Tenant', // Ensure this matches the tenant table's name
        key: 'Id',
      },
    },
    CreatedBy: {
      type: DataTypes.NUMERIC(18, 0),
      allowNull: true,
    },
    // CreatedDate: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW, // Matches DEFAULT (getdate())
    // },
    UpdatedBy: {
      type: DataTypes.NUMERIC(18, 0),
      allowNull: true,
    },
    // UpdatedDate: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    //   defaultValue: DataTypes.NOW, // Matches DEFAULT (getdate())
    // },
  },
  {
    schema: 'subscribe', // Specify the schema explicitly
    tableName: 'SubscriptionPlan', // Explicit table name
    timestamps: false, // Disable automatic timestamps
  }
);

// Define Relationships
Tenant.hasMany(SubscriptionPlan, { foreignKey: 'tenantId' });
SubscriptionPlan.belongsTo(Tenant, { foreignKey: 'tenantId' });



module.exports = SubscriptionPlan;


