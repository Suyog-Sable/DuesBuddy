const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant");

const PaymentHistory = sequelize.define(
  "PaymentHistory",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: { type: DataTypes.STRING, allowNull: false }, // Foreign key to Tenant

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SubscriptionPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TransactionRefId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    AmountReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PaymentType: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    PaymentDate: {
      type: DataTypes.DATE,
      // get: function () {
      //   // or use get(){ }
      //   return this.getDataValue("PaymentDate").toLocaleString("en-GB", {
      //     timeZone: "UTC",
      //   });
      // },
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PaymentHistory",
    schema: "subscribe",
    timestamps: false, // Because we are using `CreatedDate` and `UpdatedDate` instead of `createdAt` and `updatedAt`
  }
);
// PaymentHistory.beforeCreate((payment) => {
//   payment.PaymentDate = new Date(payment.PaymentDate)
//     .toISOString()
//     .slice(0, 19)
//     .replace("T", " ");
// });

// Hooks for updating UpdatedDate automatically
PaymentHistory.beforeUpdate((payment, options) => {
  payment.UpdatedDate = new Date(); // Update UpdatedDate before saving
});

// Association with Tenant
PaymentHistory.belongsTo(Tenant, { foreignKey: "tenantId", targetKey: "Id" }); // Now referencing Tenant's Id
Tenant.hasMany(PaymentHistory, { foreignKey: "tenantId", sourceKey: "Id" }); // Using 'Id' as the source key
module.exports = PaymentHistory;
