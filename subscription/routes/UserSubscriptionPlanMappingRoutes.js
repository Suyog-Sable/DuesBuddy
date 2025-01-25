const express = require('express');
const { 
  getAllUserSubscriptionPlanMappings,
  getUserSubscriptionPlanMappingById,
  createUserSubscriptionPlanMapping,
  updateUserSubscriptionPlanMapping,
  deleteUserSubscriptionPlanMapping,
} = require('../controllers/UserSubscriptionPlanMappingController');
const router = express.Router();

/**
 * @swagger
 * /user-subscription-plan-mappings/{tenantId}:
 *   get:
 *     tags:
 *       - UserSubscriptionPlanMapping
 *     summary: Get all user subscription plan mappings by tenant ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID associated with the user subscription plan mappings.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of user subscription plan mappings.
 *       404:
 *         description: No user subscription plan mappings found.
 *       500:
 *         description: Server error.
 */
router.get('/:tenantId', getAllUserSubscriptionPlanMappings);

/**
 * @swagger
 * /user-subscription-plan-mappings/{tenantId}/{id}:
 *   get:
 *     tags:
 *       - UserSubscriptionPlanMapping
 *     summary: Get a user subscription plan mapping by ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID associated with the user subscription plan mapping.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user subscription plan mapping to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user subscription plan mapping.
 *       404:
 *         description: User subscription plan mapping not found.
 *       500:
 *         description: Server error.
 */
router.get('/:tenantId/:id', getUserSubscriptionPlanMappingById);

/**
 * @swagger
 * /user-subscription-plan-mappings/{tenantId}:
 *   post:
 *     tags:
 *       - UserSubscriptionPlanMapping
 *     summary: Create a new user subscription plan mapping
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID associated with the new user subscription plan mapping.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserId:
 *                 type: integer
 *                 description: User ID associated with the subscription plan.
 *                 example: 101
 *               SubscriptionPlanId:
 *                 type: integer
 *                 description: Subscription plan ID associated with the user.
 *                 example: 1
 *               EffectiveDate:
 *                 type: string
 *                 format: date
 *                 description: Effective date of the subscription.
 *                 example: '2025-01-01'
 *               ValidUntil:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of the subscription.
 *                 example: '2025-12-31'
 *               Price:
 *                 type: integer
 *                 description: Subscription price.
 *                 example: 500
 *               DiscountCoupon:
 *                 type: integer
 *                 description: Discount applied to the subscription (optional).
 *                 example: 10
 *               isActive:
 *                 type: boolean
 *                 description: Whether the subscription is active.
 *                 example: true
 *               Remarks:
 *                 type: string
 *                 description: Additional remarks for the subscription plan.
 *                 example: 'First-time subscriber'
 *               CreatedBy:
 *                 type: integer
 *                 description: ID of the user who created the subscription mapping.
 *                 example: 1
 *               tenantId:
 *                 type: string
 *                 description: ID of the tenant .
 *                 example: "T001"
 *     responses:
 *       201:
 *         description: User subscription plan mapping created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User subscription plan mapping created successfully.
 *                 mapping:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                     UserId:
 *                       type: integer
 *                     SubscriptionPlanId:
 *                       type: integer
 *                     EffectiveDate:
 *                       type: string
 *                       format: date
 *                     ValidUntil:
 *                       type: string
 *                       format: date
 *                     Price:
 *                       type: integer
 *                     DiscountCoupon:
 *                       type: integer
 *                     isActive:
 *                       type: boolean
 *                     Remarks:
 *                       type: string
 *       500:
 *         description: Server error.
 */
router.post('/:tenantId', createUserSubscriptionPlanMapping);

/**
 * @swagger
 * /user-subscription-plan-mappings/{tenantId}/{id}:
 *   put:
 *     tags:
 *       - UserSubscriptionPlanMapping
 *     summary: Update a user subscription plan mapping
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID associated with the user subscription plan mapping.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user subscription plan mapping to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserId:
 *                 type: integer
 *               SubscriptionPlanId:
 *                 type: integer
 *               EffectiveDate:
 *                 type: string
 *                 format: date
 *               ValidUntil:
 *                 type: string
 *                 format: date
 *               Price:
 *                 type: integer
 *               DiscountCoupon:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               Remarks:
 *                 type: string
 *               UpdatedBy:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User subscription plan mapping updated successfully.
 *       404:
 *         description: User subscription plan mapping not found.
 *       500:
 *         description: Server error.
 */
router.put('/:tenantId/:id', updateUserSubscriptionPlanMapping);

/**
 * @swagger
 * /user-subscription-plan-mappings/{tenantId}/{planId}:
 *   delete:
 *     tags:
 *       - UserSubscriptionPlanMapping
 *     summary: Delete a user subscription plan mapping
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID associated with the user subscription plan mapping.
 *         schema:
 *           type: string
 *       - name: planId
 *         in: path
 *         required: true
 *         description: ID of the user subscription plan mapping to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User subscription plan mapping deleted successfully.
 *       404:
 *         description: User subscription plan mapping not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:tenantId/:planId', deleteUserSubscriptionPlanMapping);

module.exports = router;
