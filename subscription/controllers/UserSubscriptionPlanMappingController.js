const UserSubscriptionPlanMapping = require('../models/UserSubscriptionPlanMapping');
exports.getAllUserSubscriptionPlanMappings = async (req, res) => {
    try {
      const mappings = await UserSubscriptionPlanMapping.findAll();
  
    //   if (mappings.length === 0) {
    //     return res.status(404).json({ message: 'No user subscription mappings found.' });
    //   }
  
      res.status(200).json(mappings);
    } catch (error) {
      console.error('Error fetching user subscription mappings:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getUserSubscriptionPlanMappingById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const mapping = await UserSubscriptionPlanMapping.findOne({
        where: { Id: id }
      });
  
      if (!mapping) {
        return res.status(404).json({ message: 'User subscription mapping not found.' });
      }
  
      res.status(200).json(mapping);
    } catch (error) {
      console.error('Error fetching user subscription mapping:', error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.createUserSubscriptionPlanMapping = async (req, res) => {
    try {
      const { tenantId, UserId, SubscriptionPlanId, EffectiveDate, ValidUntil, Price, DiscountCoupon, isActive, Remarks, CreatedBy } = req.body;
  
      const newMapping = await UserSubscriptionPlanMapping.create({
        tenantId,
        UserId,
        SubscriptionPlanId,
        EffectiveDate:new Date(EffectiveDate),
        ValidUntil:new Date(ValidUntil),
        Price,
        DiscountCoupon,
        isActive,
        Remarks,
        CreatedBy
      });
  
      res.status(201).json(newMapping);
    } catch (error) {
      console.error('Error creating user subscription mapping:', error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.updateUserSubscriptionPlanMapping = async (req, res) => {
    try {
      const { id } = req.params;
      const { tenantId, UserId, SubscriptionPlanId, EffectiveDate, ValidUntil, Price, DiscountCoupon, isActive, Remarks, UpdatedBy } = req.body;
  
      const mapping = await UserSubscriptionPlanMapping.findOne({
        where: { Id: id }
      });
  
      if (!mapping) {
        return res.status(404).json({ message: 'User subscription mapping not found.' });
      }
  
      mapping.tenantId = tenantId || mapping.tenantId;
      mapping.UserId = UserId || mapping.UserId;
      mapping.SubscriptionPlanId = SubscriptionPlanId || mapping.SubscriptionPlanId;
      mapping.EffectiveDate = new Date(EffectiveDate) || new Date(mapping.EffectiveDate);
      mapping.ValidUntil = new Date(ValidUntil) || new Date(mapping.ValidUntil);
      mapping.Price = Price || mapping.Price;
      mapping.DiscountCoupon = DiscountCoupon || mapping.DiscountCoupon;
      mapping.isActive = isActive !== undefined ? isActive : mapping.isActive;
      mapping.Remarks = Remarks || mapping.Remarks;
      mapping.UpdatedBy = UpdatedBy || mapping.UpdatedBy;
  
      await mapping.save();
  
      res.status(200).json(mapping);
    } catch (error) {
      console.error('Error updating user subscription mapping:', error);
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
        return res.status(404).json({ message: 'User Subscription plan mapping not found.' });
      }
  
      await plan.destroy();
  
      res.status(200).json({ message: 'User Subscription plan mapping deleted successfully.' });
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      res.status(500).json({ error: error.message });
    }
  };
        