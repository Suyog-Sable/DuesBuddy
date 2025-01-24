const express = require('express');
const { 
    getSubscriptionPlansByTenantId,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
} = require('../controllers/subscriptionPlanController');
const router = express.Router();

/**
 * @swagger
 * /subscription-plans/{tenantId}:
 *   get:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Get all subscription plans by tenant ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter subscription plans.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of subscription plans.
 *       404:
 *         description: No subscription plans found.
 *       500:
 *         description: Server error.
 */
router.get('/:tenantId', getSubscriptionPlansByTenantId);

/**
 * @swagger
 * /subscription-plans:
 *   post:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Create a new subscription plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Amount:
 *                 type: integer
 *               Days:
 *                 type: integer
 *               TenantId:
 *                 type: integer
 *               IsActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Subscription plan created successfully.
 *       500:
 *         description: Server error.
 */
router.post('/', createSubscriptionPlan);

/**
 * @swagger
 * /subscription-plans/{tenantId}/{planId}:
 *   put:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Update an existing subscription plan
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID for filtering the subscription plans.
 *       - name: planId
 *         in: path
 *         required: true
 *         description: Subscription plan ID to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Amount:
 *                 type: integer
 *               Days:
 *                 type: integer
 *               IsActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully.
 *       404:
 *         description: Subscription plan not found.
 *       500:
 *         description: Server error.
 */
router.put('/:tenantId/:planId', updateSubscriptionPlan);

/**
 * @swagger
 * /subscription-plans/{tenantId}/{planId}:
 *   delete:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Delete a subscription plan
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID for filtering the subscription plans.
 *       - name: planId
 *         in: path
 *         required: true
 *         description: Subscription plan ID to delete.
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully.
 *       404:
 *         description: Subscription plan not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:tenantId/:planId', deleteSubscriptionPlan);

module.exports = router;
