const { Op } = require("sequelize");
const Tenant = require("../models/tenant");
const User = require("../models/user");
const SubscriptionPlan = require("../models/subscriptionPlan");
const UserSubscriptionPlanMapping = require("../models/UserSubscriptionPlanMapping");
const PaymentHistory = require("../models/PaymentHistory");
const Attendance = require("../models/Attendance");

// user summary
exports.searchUsersWithSubscriptions = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { Name, MobileNo } = req.body;

    // Fetch tenant database connection
    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
    });
    // const tenant = await Tenant.findOne({ where: { Id: tenantId } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const searchCriteria = { TenantId: tenantId }; // Ensure only users of the specified tenant are fetched
    if (Name) {
      searchCriteria.Name = { [Op.like]: `%${Name}%` };
    }
    if (MobileNo) {
      searchCriteria.MobileNo = MobileNo;
    }
    // Define associations
    User.hasMany(UserSubscriptionPlanMapping, { foreignKey: "UserId" });
    UserSubscriptionPlanMapping.belongsTo(SubscriptionPlan, {
      foreignKey: "SubscriptionPlanId",
    });
    UserSubscriptionPlanMapping.hasMany(PaymentHistory, {
      foreignKey: "SubscriptionPlanId", // Ensure payments are linked to the SubscriptionPlanId
    });

    const users = await User.findAll({
      where: searchCriteria,
      attributes: ["Id", "Name", "MobileNo", "ProfileImagePath"],
      include: [
        {
          model: UserSubscriptionPlanMapping,
          attributes: [
            "Id",
            "SubscriptionPlanId",
            "Price",
            "ValidUntil",
            "isActive",
          ],
          include: [
            {
              model: SubscriptionPlan,
              attributes: ["Id", "Name", "Shortcode"],
            },
            {
              model: PaymentHistory,
              required: false,
              attributes: ["AmountReceived", "SubscriptionPlanId"],
            },
          ],
        },
      ],
    });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found matching the criteria." });
    }

    const currentDate = new Date();
    const results = users.map((user) => {
      const subscriptions = user.UserSubscriptionPlanMappings.map(
        (subscription) => {
          const payments = subscription.PaymentHistories || [];
          const totalPaid = payments.reduce(
            (acc, payment) => acc + (payment.AmountReceived || 0),
            0
          );
          const remainingDue = subscription.Price - totalPaid;
          const isActive =
            subscription.isActive &&
            new Date(subscription.ValidUntil) > currentDate;

          return {
            SubscriptionPlanName: subscription?.SubscriptionPlan?.Name || "N/A",
            Shortcode: subscription?.SubscriptionPlan?.Shortcode || "N/A",
            Status: isActive ? "valid-Active" : "valid-Inactive",
            DueDate:
              new Date(subscription?.ValidUntil) > currentDate
                ? subscription.ValidUntil.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null,
            PendingDue: remainingDue > 0 ? remainingDue.toString() : "NA",
          };
        }
      );

      return {
        Id: user.Id,
        Name: user.Name,
        MobileNo: user.MobileNo,
        ProfileImagePath: user.ProfileImagePath,
        Subscriptions: subscriptions,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching user subscription status:", error);
    res.status(500).json({ error: error.message });
  }
};

// user detailed information
exports.getUserWithSubscriptions = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.params;

    // Fetch tenant database connection
    const tenant = await Tenant.findOne({ where: { Id: tenantId } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    //  Define associations if not already done
    User.hasMany(UserSubscriptionPlanMapping, { foreignKey: "UserId" });
    UserSubscriptionPlanMapping.belongsTo(SubscriptionPlan, {
      foreignKey: "SubscriptionPlanId",
    });
    UserSubscriptionPlanMapping.hasMany(PaymentHistory, {
      foreignKey: "UserId",
    });
    User.hasMany(Attendance, { foreignKey: "UserId" });

    // 🔍 Fetch user with subscriptions, payments, and attendance
    const user = await User.findOne({
      where: { Id: userId },
      attributes: ["Id", "Name", "MobileNo", "ProfileImagePath"],
      include: [
        {
          model: UserSubscriptionPlanMapping,
          attributes: [
            "Id",
            "SubscriptionPlanId",
            "Price",
            "ValidUntil",
            "isActive",
          ],
          include: [
            {
              model: SubscriptionPlan,
              attributes: ["Id", "Name", "Shortcode"],
            },
            {
              model: PaymentHistory,
              required: false,
              attributes: ["AmountReceived", "SubscriptionPlanId"],
            },
          ],
        },
        {
          model: Attendance,
          required: false,
          attributes: ["CheckIn", "CheckInBy", "CheckOut", "CheckOutBy"],
          order: [["CheckIn", "DESC"]],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDate = new Date();
    const output = {
      Id: user.Id,
      Name: user.Name,
      ProfileImagePath: user.ProfileImagePath,
      MobileNo: user.MobileNo,
      CheckedIn: false,
      CheckedOut: false,
      Subscriptions: [],
      Attendance: {},
    };

    //  Handle Attendance (Optimized)
    if (user.Attendances.length > 0) {
      const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

      const todayAttendance = user.Attendances.find((attendance) =>
        isSameDay(new Date(attendance.CheckIn), currentDate)
      );

      if (todayAttendance) {
        output.Attendance = {
          CheckIn: todayAttendance.CheckIn
            ? new Date(todayAttendance.CheckIn)
                .toISOString()
                .replace("T", " ")
                .slice(0, 19)
            : null,
          CheckInBy: todayAttendance.CheckInBy || null,
          CheckOut: todayAttendance.CheckOut
            ? new Date(todayAttendance.CheckOut)
                .toISOString()
                .replace("T", " ")
                .slice(0, 19)
            : null,
          CheckOutBy: todayAttendance.CheckOutBy || null,
        };

        output.CheckedIn = !!todayAttendance.CheckIn;
        output.CheckedOut = !!todayAttendance.CheckOut;
      }
    }

    //  Process Subscriptions and Payments
    output.Subscriptions = user.UserSubscriptionPlanMappings.map((mapping) => {
      const totalPaid = mapping.PaymentHistories
        ? mapping.PaymentHistories.reduce(
            (acc, payment) => acc + (payment.AmountReceived || 0),
            0
          )
        : 0;

      const remainingDue = mapping.Price - totalPaid;
      const isActive =
        mapping.isActive && new Date(mapping.ValidUntil) > currentDate;

      return {
        Id: mapping.Id,
        PlanName: mapping.SubscriptionPlan?.Name || "N/A",
        Shortcode: mapping.SubscriptionPlan?.Shortcode || "N/A",
        Status: isActive ? "valid-Active" : "valid-Inactive",
        DueDate:
          new Date(mapping.ValidUntil) > currentDate
            ? mapping.ValidUntil.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : null,
        PendingDue: remainingDue > 0 ? remainingDue.toString() : "NA",
      };
    });

    res.status(200).json(output);
  } catch (error) {
    console.error("Error fetching user with subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch user with subscriptions" });
  }
};
