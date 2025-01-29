const express = require("express");
const router = express.Router();
const {
  searchUsersWithSubscriptions,
  getUserWithSubscriptions,
} = require("../controllers/UserDetailsController");

/**
 * @swagger
 * /search/{tenantId}:
 *   post:
 *     summary: Search users by name or mobile number within a tenant
 *     tags:
 *       - UserDetails
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter users.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Name of the user to search.
 *               MobileNo:
 *                 type: string
 *                 description: Mobile number of the user to search.
 *     responses:
 *       200:
 *         description: A list of matched users with subscription details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id:
 *                     type: integer
 *                   Name:
 *                     type: string
 *                   MobileNo:
 *                     type: string
 *                   ProfileImagePath:
 *                     type: string
 *                   Subscriptions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         SubscriptionPlanName:
 *                           type: string
 *                         Shortcode:
 *                           type: string
 *                         Status:
 *                           type: string
 *                         DueDate:
 *                           type: string
 *                         PendingDue:
 *                           type: string
 *       404:
 *         description: No users found matching the criteria.
 *       500:
 *         description: Server error.
 */
router.post("/search/:tenantId", searchUsersWithSubscriptions);

/**
 * @swagger
 * /detail/{tenantId}/{id}:
 *   get:
 *     summary: Fetch a user's details along with their subscriptions, payments, and attendance.
 *     tags:
 *       - UserDetails
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: The ID of the tenant to fetch user details from.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose details need to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user details along with subscriptions, payments, and attendance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Id:
 *                   type: string
 *                 Name:
 *                   type: string
 *                 ProfileImagePath:
 *                   type: string
 *                 MobileNo:
 *                   type: string
 *                 CheckedIn:
 *                   type: boolean
 *                 CheckedOut:
 *                   type: boolean
 *                 Subscriptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Id:
 *                         type: string
 *                       PlanName:
 *                         type: string
 *                       Shortcode:
 *                         type: string
 *                       Status:
 *                         type: string
 *                         enum: ["valid-Active", "valid-Inactive"]
 *                       DueDate:
 *                         type: string
 *                         format: date
 *                       PendingDue:
 *                         type: string
 *                 Attendance:
 *                   type: object
 *                   properties:
 *                     CheckIn:
 *                       type: string
 *                       format: date-time
 *                     CheckInBy:
 *                       type: string
 *                     CheckOut:
 *                       type: string
 *                       format: date-time
 *                     CheckOutBy:
 *                       type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/detail/:tenantId/:id", getUserWithSubscriptions);

module.exports = router;
