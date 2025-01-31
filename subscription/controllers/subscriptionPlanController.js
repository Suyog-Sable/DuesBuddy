const Tenant = require("../models/tenant");
const SubscriptionPlan = require("../models/subscriptionPlan");

exports.getSubscriptionPlansByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: SubscriptionPlan,
          attributes: ["Id", "Name", "Amount", "Days", "IsActive", "Shortcode"],
          // ensure that the association key is correctly set
          required: true,
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "SubscriptionPlan not found." });
    }

    const response = tenant.SubscriptionPlans.map((plan) => ({
      tenantId: plan.tenantId,
      Id: plan.Id,
      Name: plan.Name,
      Amount: plan.Amount,
      Days: plan.Days,
      IsActive: plan.IsActive,
      Shortcode: plan.Shortcode,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new subscription plan
exports.createSubscriptionPlan = async (req, res) => {
  try {
    const { Name, Amount, Days, tenantId, IsActive, Shortcode } = req.body;

    const newPlan = await SubscriptionPlan.create({
      Name,
      Shortcode,
      Amount,
      Days,
      tenantId,
      IsActive,
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing subscription plan
exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const { tenantId, planId } = req.params;
    const { Name, Amount, Days, IsActive, Shortcode } = req.body;

    const plan = await SubscriptionPlan.findOne({
      where: { tenantId: tenantId, id: planId },
    });

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found." });
    }

    plan.Name = Name || plan.Name;
    plan.Amount = Amount || plan.Amount;
    plan.Days = Days || plan.Days;
    (plan.Shortcode = Shortcode || plan.Shortcode),
      (plan.IsActive = IsActive !== undefined ? IsActive : plan.IsActive);

    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a subscription plan
exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    const { tenantId, planId } = req.params;

    const plan = await SubscriptionPlan.findOne({
      where: { tenantId: tenantId, id: planId },
    });

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found." });
    }

    await plan.destroy();

    res
      .status(200)
      .json({ message: "Subscription plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    res.status(500).json({ error: error.message });
  }
};
