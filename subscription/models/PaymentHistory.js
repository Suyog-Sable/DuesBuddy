const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant");
const moment = require("moment-timezone");

const PaymentHistory = sequelize.define(
  "PaymentHistory",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: { type: DataTypes.STRING, allowNull: false },

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
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("PaymentDate");
        // Convert the raw stored date to IST (Indian Standard Time) when fetching
        if (rawValue) {
          return moment.utc(rawValue).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        }
        return null;
      },
      set(value) {
        // Convert incoming date to IST before saving and store it as UTC in the database
        const dateInIST = moment.tz(value, 'Asia/Kolkata');  // Convert input value to IST
        const dateInUTC = dateInIST.utc().toDate();          // Convert to UTC before storing
        this.setDataValue("PaymentDate", dateInUTC);         // Store as UTC in DB
      },
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
    timestamps: false,
  }
);

// Auto-update UpdatedDate before saving
PaymentHistory.beforeUpdate((payment, options) => {
  payment.UpdatedDate = new Date().toISOString().split("T")[0]; // Store only date (without time)
});

// Association with Tenant
PaymentHistory.belongsTo(Tenant, { foreignKey: "tenantId", targetKey: "Id" });
Tenant.hasMany(PaymentHistory, { foreignKey: "tenantId", sourceKey: "Id" });

module.exports = PaymentHistory;
