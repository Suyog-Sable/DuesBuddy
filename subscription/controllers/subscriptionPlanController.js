const Tenant = require('../models/tenant');
const SubscriptionPlan = require('../models/subscriptionPlan');


exports.getSubscriptionPlansByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findOne({
      where: { TenantId: tenantId },
      include: [{
        model: SubscriptionPlan,
        attributes: ['Id', 'Name', 'Amount', 'Days', 'IsActive'],
      }],
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const response = {
      TenantId: tenant.TenantId,
      Email: tenant.Email,
      Plan: tenant.SubscriptionPlans.map(plan => ({
        Id: plan.Id,
        Name: plan.Name,
        Amount: plan.Amount,
        Days: plan.Days,
        IsActive: plan.IsActive,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new subscription plan
exports.createSubscriptionPlan = async (req, res) => {
    try {
      const { Name, Amount, Days, TenantId, IsActive } = req.body;
  
      const newPlan = await SubscriptionPlan.create({
        Name,
        Amount,
        Days,
        TenantId,
        IsActive,
      });
  
      res.status(201).json(newPlan);
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      res.status(500).json({ error: error.message });
    }
};

// Update an existing subscription plan
exports.updateSubscriptionPlan = async (req, res) => {
    try {
      const { tenantId, planId } = req.params;
      const { Name, Amount, Days, IsActive } = req.body;
  
      const plan = await SubscriptionPlan.findOne({
        where: { TenantId: tenantId, id: planId },
      });
  
      if (!plan) {
        return res.status(404).json({ message: 'Subscription plan not found.' });
      }
  
      plan.Name = Name || plan.Name;
      plan.Amount = Amount || plan.Amount;
      plan.Days = Days || plan.Days;
      plan.IsActive = IsActive !== undefined ? IsActive : plan.IsActive;
  
      await plan.save();
  
      res.status(200).json(plan);
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      res.status(500).json({ error: error.message });
    }
};

// Delete a subscription plan
exports.deleteSubscriptionPlan = async (req, res) => {
    try {
      const { tenantId, planId } = req.params;
  
      const plan = await SubscriptionPlan.findOne({
        where: { TenantId: tenantId, id: planId },
      });
  
      if (!plan) {
        return res.status(404).json({ message: 'Subscription plan not found.' });
      }
  
      await plan.destroy();
  
      res.status(200).json({ message: 'Subscription plan deleted successfully.' });
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      res.status(500).json({ error: error.message });
    }
};
  

