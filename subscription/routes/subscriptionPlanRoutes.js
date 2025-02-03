const express = require("express");
const {
  getSubscriptionPlansByTenantId,
  getSubscriptionPlanById, // New function to get subscription plan by Id
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require("../controllers/subscriptionPlanController");
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
 *         description: Tenant ID to fetch subscription plans.
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
router.get("/:tenantId", getSubscriptionPlansByTenantId);

/**
 * @swagger
 * /subscription-plans/{tenantId}/{planId}:
 *   get:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Get a subscription plan by tenant ID and plan ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter the subscription plan.
 *         schema:
 *           type: integer
 *       - name: planId
 *         in: path
 *         required: true
 *         description: Subscription plan ID.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The subscription plan details.
 *       404:
 *         description: Subscription plan not found.
 *       500:
 *         description: Server error.
 */
router.get("/:tenantId/:planId", getSubscriptionPlanById); // New route

/**
 * @swagger
 * /subscription-plans/{tenantId}:
 *   post:
 *     tags:
 *       - SubscriptionPlan
 *     summary: Create a new subscription plan
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to associate the new subscription plan.
 *         schema:
 *           type: integer
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
 *               tenantId:
 *                 type: integer
 *               IsActive:
 *                 type: boolean
 *               Shortcode:
 *                 type: string
 *               Sessions:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subscription plan created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription plan created successfully.
 *                 plan:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                     Name:
 *                       type: string
 *                     Amount:
 *                       type: integer
 *                     Days:
 *                       type: integer
 *                     tenantId:
 *                       type: integer
 *                     IsActive:
 *                       type: boolean
 *                     Shortcode:
 *                       type: string
 *                     Sessions:
 *                       type: integer
 *       500:
 *         description: Server error.
 */
router.post("/:tenantId", createSubscriptionPlan);

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
 *         schema:
 *           type: integer
 *       - name: planId
 *         in: path
 *         required: true
 *         description: Subscription plan ID to update.
 *         schema:
 *           type: integer
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
 *               Shortcode:
 *                 type: string
 *               Sessions:
 *                 type: integer
 *               tenantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully.
 *       404:
 *         description: Subscription plan not found.
 *       500:
 *         description: Server error.
 */
router.put("/:tenantId/:planId", updateSubscriptionPlan);

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
 *         schema:
 *           type: integer
 *       - name: planId
 *         in: path
 *         required: true
 *         description: Subscription plan ID to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully.
 *       404:
 *         description: Subscription plan not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:tenantId/:planId", deleteSubscriptionPlan);

module.exports = router;
