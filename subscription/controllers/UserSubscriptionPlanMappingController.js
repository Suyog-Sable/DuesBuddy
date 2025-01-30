const UserSubscriptionPlanMapping = require("../models/UserSubscriptionPlanMapping");
const Tenant = require("../models/tenant");
const moment = require("moment");

exports.getAllUserSubscriptionPlanMappings = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: UserSubscriptionPlanMapping,
          attributes: [
            "Id",
            "tenantId",
            "UserId",
            "SubscriptionPlanId",
            "EffectiveDate",
            "ValidUntil",
            "Price",
            "DiscountCoupon",
            "isActive",
            "DeactivateDate",
            "ReactivateDate",
            "Remarks",
            "CreatedBy",
            "UpdatedBy",
          ],
          required: true,
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const response = tenant.UserSubscriptionPlanMappings.map((mapping) => ({
      Id: mapping.Id,
      tenantId: mapping.tenantId,
      UserId: mapping.UserId,
      SubscriptionPlanId: mapping.SubscriptionPlanId,
      EffectiveDate: moment.utc(mapping.EffectiveDate).format("DD MMM YYYY"),
      ValidUntil: moment.utc(mapping.ValidUntil).format("DD MMM YYYY"),
      Price: mapping.Price,
      DiscountCoupon: mapping.DiscountCoupon,
      isActive: mapping.isActive,
      DeactivateDate: mapping.DeactivateDate
        ? moment.utc(mapping.DeactivateDate).format("DD MMM YYYY")
        : null,
      ReactivateDate: mapping.ReactivateDate
        ? moment.utc(mapping.ReactivateDate).format("DD MMM YYYY")
        : null,
      Remarks: mapping.Remarks,
      CreatedBy: mapping.CreatedBy,
      UpdatedBy: mapping.UpdatedBy,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user subscription mappings:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscriptionPlanMappingById = async (req, res) => {
  try {
    const { id, tenantId } = req.params;

    const mapping = await UserSubscriptionPlanMapping.findOne({
      where: { Id: id, tenantId: tenantId },
    });

    if (!mapping) {
      return res
        .status(404)
        .json({ message: "User subscription mapping not found." });
    }

    res.status(200).json(mapping);
  } catch (error) {
    console.error("Error fetching user subscription mapping:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.createUserSubscriptionPlanMapping = async (req, res) => {
  try {
    // Extract tenantId from path parameters
    const { tenantId } = req.params;

    // Validate tenantId
    if (!tenantId) {
      return res.status(400).json({
        message: "tenantId is required in the path parameter.",
      });
    }

    // Check if tenant exists
    const tenant = await Tenant.findOne({ where: { Id: tenantId } });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }
    const {
      UserId,
      SubscriptionPlanId,
      EffectiveDate,
      ValidUntil,
      Price,
      DiscountCoupon,
      isActive,
      Remarks,
      CreatedBy,
    } = req.body;

    const newMapping = await UserSubscriptionPlanMapping.create({
      tenantId,
      UserId,
      SubscriptionPlanId,
      EffectiveDate: new Date(EffectiveDate),
      ValidUntil: new Date(ValidUntil),
      Price,
      DiscountCoupon,
      isActive,
      Remarks,
      CreatedBy,
    });

    res.status(201).json(newMapping);
  } catch (error) {
    console.error("Error creating user subscription mapping:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.updateUserSubscriptionPlanMapping = async (req, res) => {
  try {
    const { id, tenantId } = req.params;
    const {
      UserId,
      SubscriptionPlanId,
      EffectiveDate,
      ValidUntil,
      Price,
      DiscountCoupon,
      isActive,
      Remarks,
      UpdatedBy,
    } = req.body;

    const mapping = await UserSubscriptionPlanMapping.findOne({
      where: { Id: id, tenantId: tenantId },
    });

    if (!mapping) {
      return res
        .status(404)
        .json({ message: "User subscription mapping not found." });
    }

    mapping.tenantId = tenantId || mapping.tenantId;
    mapping.UserId = UserId || mapping.UserId;
    mapping.SubscriptionPlanId =
      SubscriptionPlanId || mapping.SubscriptionPlanId;
    mapping.EffectiveDate =
      new Date(EffectiveDate) || new Date(mapping.EffectiveDate);
    mapping.ValidUntil = new Date(ValidUntil) || new Date(mapping.ValidUntil);
    mapping.Price = Price || mapping.Price;
    mapping.DiscountCoupon = DiscountCoupon || mapping.DiscountCoupon;
    mapping.isActive = isActive !== undefined ? isActive : mapping.isActive;
    mapping.Remarks = Remarks || mapping.Remarks;
    mapping.UpdatedBy = UpdatedBy || mapping.UpdatedBy;

    await mapping.save();

    res.status(200).json(mapping);
  } catch (error) {
    console.error("Error updating user subscription mapping:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserSubscriptionPlanMapping = async (req, res) => {
  try {
    const { tenantId, planId } = req.params; // Make sure to use 'planId' here to match the route

    const plan = await UserSubscriptionPlanMapping.findOne({
      where: { tenantId: tenantId, Id: planId }, // Use 'planId' here
    });

    if (!plan) {
      return res
        .status(404)
        .json({ message: "User Subscription plan mapping not found." });
    }

    await plan.destroy();

    res.status(200).json({
      message: "User Subscription plan mapping deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    res.status(500).json({ error: error.message });
  }
};
