const express = require("express");
const {
  getSystemUsersByTenantId,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
} = require("../controllers/SystemUserController");
const router = express.Router();

/**
 * @swagger
 * /system-users/{tenantId}:
 *   get:
 *     tags:
 *       - SystemUser
 *     summary: Get all system users by tenant ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to fetch associated system users.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of system users.
 *       404:
 *         description: No system users found.
 *       500:
 *         description: Server error.
 */
router.get("/:tenantId", getSystemUsersByTenantId);

/**
 * @swagger
 * /system-users:
 *   post:
 *     tags:
 *       - SystemUser
 *     summary: Create a new system user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *                 description: Full name of the system user
 *                 example: John Doe
 *               MobileNumber:
 *                 type: string
 *                 description: Mobile number of the system user
 *                 example: "1234567890"
 *               UserName:
 *                 type: string
 *                 description: Username of the system user
 *                 example: johndoe
 *               Password:
 *                 type: string
 *                 description: Password for the system user
 *                 example: Password123!
 *               Role:
 *                 type: string
 *                 description: Role of the system user
 *                 example: Admin
 *               tenantId:
 *                 type: integer
 *                 description: Tenant ID associated with the system user
 *                 example: 1
 *     responses:
 *       201:
 *         description: System user created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: System user created successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                     FullName:
 *                       type: string
 *                     MobileNumber:
 *                       type: string
 *                     UserName:
 *                       type: string
 *                     Role:
 *                       type: string
 *                     tenantId:
 *                       type: integer
 *       500:
 *         description: Server error.
 */
router.post("/", createSystemUser);

/**
 * @swagger
 * /system-users/{tenantId}/{userId}:
 *   put:
 *     tags:
 *       - SystemUser
 *     summary: Update an existing system user
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID for filtering the system users.
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         description: System user ID to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               MobileNumber:
 *                 type: string
 *               UserName:
 *                 type: string
 *               Password:
 *                 type: string
 *               Role:
 *                 type: string
 *     responses:
 *       200:
 *         description: System user updated successfully.
 *       404:
 *         description: System user not found.
 *       500:
 *         description: Server error.
 */
router.put("/:tenantId/:userId", updateSystemUser);

/**
 * @swagger
 * /system-users/{tenantId}/{userId}:
 *   delete:
 *     tags:
 *       - SystemUser
 *     summary: Delete a system user
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID for filtering the system users.
 *       - name: userId
 *         in: path
 *         required: true
 *         description: System user ID to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: System user deleted successfully.
 *       404:
 *         description: System user not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:tenantId/:userId", deleteSystemUser);

module.exports = router;
