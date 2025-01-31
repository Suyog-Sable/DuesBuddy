const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant"); // Import Tenant model
const User = require("./user");
const SubscriptionPlan = require("./subscriptionPlan");
const UserSubscriptionPlanMapping = sequelize.define(
  "UserSubscriptionPlanMapping",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Referencing Sequelize User model
        key: "Id",
      },
    },
    SubscriptionPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SubscriptionPlan, // Referencing Sequelize SubscriptionPlan model
        key: "Id",
      },
    },
    EffectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ValidUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DiscountCoupon: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    DeactivateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ReactivateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Remarks: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // CreatedDate: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    UpdatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // UpdatedDate: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
  },
  {
    schema: "subscribe",
    tableName: "UserSubscriptionPlanMapping",
    timestamps: false,
  }
);

// Establish Associations
UserSubscriptionPlanMapping.belongsTo(Tenant, {
  foreignKey: "tenantId",
  targetKey: "Id",
}); // Now referencing Tenant's Id
Tenant.hasMany(UserSubscriptionPlanMapping, {
  foreignKey: "tenantId",
  sourceKey: "Id",
}); // Using 'Id' as the source key

UserSubscriptionPlanMapping.belongsTo(User, { foreignKey: "UserId" });
UserSubscriptionPlanMapping.belongsTo(SubscriptionPlan, {
  foreignKey: "SubscriptionPlanId",
});

module.exports = UserSubscriptionPlanMapping;
