const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Tenant = require("./tenant"); // Import Tenant model

// Define the User model
const User = sequelize.define(
  "User",
  {
    Id: {
      type: DataTypes.INTEGER, // Correct data type for ID
      primaryKey: true,
      autoIncrement: true,
    },
    Name: { type: DataTypes.STRING, allowNull: false },
    Wing: { type: DataTypes.STRING, allowNull: true },
    RoomNo: { type: DataTypes.STRING, allowNull: true },
    MobileNo: { type: DataTypes.STRING, allowNull: false },
    EmailId: { type: DataTypes.STRING, allowNull: false },
    Gender: { type: DataTypes.STRING, allowNull: false },
    AadharImagePath: { type: DataTypes.STRING, allowNull: true },
    PermanentAddress: { type: DataTypes.STRING, allowNull: true },
    PresentAddress: { type: DataTypes.STRING, allowNull: true },
    Location: { type: DataTypes.STRING, allowNull: false },
    ProfileImagePath: { type: DataTypes.STRING, allowNull: true },
    DOB: { type: DataTypes.DATEONLY, allowNull: false },
    IsTrainer: { type: DataTypes.BOOLEAN, defaultValue: false },
    CreatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    UpdatedBy: { type: DataTypes.INTEGER, allowNull: true },
    UpdatedDate: { type: DataTypes.DATE, allowNull: true },
    Extra1: { type: DataTypes.STRING, allowNull: true },
    Extra2: { type: DataTypes.STRING, allowNull: true },
    Extra3: { type: DataTypes.STRING, allowNull: true },
    tenantId: { type: DataTypes.STRING, allowNull: false }, // Foreign key to Tenant
  },
  {
    tableName: "User",
    schema: "subscribe",
    timestamps: false, // Disable automatic timestamps
  }
);

// Hooks for updating UpdatedDate automatically
User.beforeUpdate((user, options) => {
  user.UpdatedDate = new Date(); // Update UpdatedDate before saving
});

// Association with Tenant
User.belongsTo(Tenant, { foreignKey: "tenantId", targetKey: "Id" }); // Now referencing Tenant's Id
Tenant.hasMany(User, { foreignKey: "tenantId", sourceKey: "Id" }); // Using 'Id' as the source key

module.exports = User;
