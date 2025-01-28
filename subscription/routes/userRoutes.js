const express = require("express");
const {
  getUsersByTenantId,
  getUserByIdAndTenant,
  createUser,
  updateUser,
  deleteUser,
  getFormattedUsersByTenantId,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /users/{tenantId}:
 *   get:
 *     summary: Get all users by tenant ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter users.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users.
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
 *                   Wing:
 *                     type: string
 *                   RoomNo:
 *                     type: string
 *                   MobileNo:
 *                     type: string
 *                   EmailId:
 *                     type: string
 *                   Gender:
 *                     type: string
 *                   AadharImagePath:
 *                     type: string
 *                   PermanentAddress:
 *                     type: string
 *                   PresentAddress:
 *                     type: string
 *                   Location:
 *                     type: string
 *                   ProfileImagePath:
 *                     type: string
 *                   DOB:
 *                     type: string
 *                     format: date-time
 *                   IsTrainer:
 *                     type: boolean
 *                   CreatedBy:
 *                     type: integer
 *                   CreatedDate:
 *                     type: string
 *                     format: date-time
 *                   UpdatedBy:
 *                     type: integer
 *                   UpdatedDate:
 *                     type: date
 *                     format: date-time
 *                   Extra1:
 *                     type: string
 *                   Extra2:
 *                     type: string
 *                   Extra3:
 *                     type: string
 *                   TenantId:
 *                     type: integer
 *       404:
 *         description: No users found.
 *       500:
 *         description: Server error.
 */
router.get("/:tenantId", getUsersByTenantId);

/**
 * @swagger
 * /users/single/{tenantId}/{userId}:
 *   get:
 *     summary: Get a specific user by tenant ID and user ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter users.
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID to retrieve the specific user.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific user's details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Id:
 *                   type: integer
 *                 Name:
 *                   type: string
 *                 Wing:
 *                   type: string
 *                 RoomNo:
 *                   type: string
 *                 MobileNo:
 *                   type: string
 *                 EmailId:
 *                   type: string
 *                 Gender:
 *                   type: string
 *                 AadharImagePath:
 *                   type: string
 *                 PermanentAddress:
 *                   type: string
 *                 PresentAddress:
 *                   type: string
 *                 Location:
 *                   type: string
 *                 ProfileImagePath:
 *                   type: string
 *                 DOB:
 *                   type: dateonly
 *                   format: date
 *                 IsTrainer:
 *                   type: boolean
 *                 CreatedBy:
 *                   type: integer
 *                 CreatedDate:
 *                   type: date
 *                   format: date-time
 *                 UpdatedBy:
 *                   type: integer
 *                 UpdatedDate:
 *                   type: date
 *                   format: date-time
 *                 Extra1:
 *                   type: string
 *                 Extra2:
 *                   type: string
 *                 Extra3:
 *                   type: string
 *                 TenantId:
 *                   type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get("/single/:tenantId/:userId", getUserByIdAndTenant);

/**
 * @swagger
 * /users/{tenantId}:
 *   post:
 *     summary: Create a new user for a specific tenant.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to associate the new user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: John Doe
 *               Wing:
 *                 type: string
 *               RoomNo:
 *                 type: string
 *               MobileNo:
 *                 type: string
 *                 example: "+1234567890"
 *               EmailId:
 *                 type: string
 *                 example: john.doe@example.com
 *               Gender:
 *                 type: string
 *               AadharImagePath:
 *                 type: string
 *                 format: binary
 *               PermanentAddress:
 *                 type: string
 *               PresentAddress:
 *                 type: string
 *               Location:
 *                 type: string
 *               ProfileImagePath:
 *                 type: string
 *                 format: binary
 *               DOB:
 *                 type: string
 *                 format: date-time
 *               IsTrainer:
 *                 type: boolean
 *                 default: false
 *               CreatedBy:
 *                 type: integer
 *               Extra1:
 *                 type: string
 *               Extra2:
 *                 type: string
 *               Extra3:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                     Name:
 *                       type: string
 *                     Wing:
 *                       type: string
 *                     RoomNo:
 *                       type: string
 *                     MobileNo:
 *                       type: string
 *                     EmailId:
 *                       type: string
 *                     Gender:
 *                       type: string
 *                     AadharImagePath:
 *                       type: string
 *                     PermanentAddress:
 *                       type: string
 *                     PresentAddress:
 *                       type: string
 *                     Location:
 *                       type: string
 *                     ProfileImagePath:
 *                       type: string
 *                     DOB:
 *                       type: string
 *                       format: date-time
 *                     IsTrainer:
 *                       type: boolean
 *                     CreatedBy:
 *                       type: integer
 *                     CreatedDate:
 *                       type: string
 *                       format: date-time
 *                     UpdatedBy:
 *                       type: integer
 *                     UpdatedDate:
 *                       type: string
 *                       format: date-time
 *                     Extra1:
 *                       type: string
 *                     Extra2:
 *                       type: string
 *                     Extra3:
 *                       type: string
 *                     tenantId:
 *                       type: string
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Tenant not found.
 *       500:
 *         description: Server error.
 */
router.post("/:tenantId", createUser);

/**
 * @swagger
 * /users/{tenantId}/{userId}:
 *   put:
 *     summary: Update user by tenant ID and user ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter users.
 *         schema:
 *           type: integer
 *       - name: Id
 *         in: path
 *         required: true
 *         description: User ID to identify the user to be updated.
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
 *               Wing:
 *                 type: string
 *               RoomNo:
 *                 type: string
 *               MobileNo:
 *                 type: string
 *               EmailId:
 *                 type: string
 *               Gender:
 *                 type: string
 *               AadharImagePath:
 *                 type: string
 *               PermanentAddress:
 *                 type: string
 *               PresentAddress:
 *                 type: string
 *               Location:
 *                 type: string
 *               ProfileImagePath:
 *                 type: string
 *               DOB:
 *                 type: dateonly
 *                 format: date
 *               IsTrainer:
 *                 type: boolean
 *               CreatedBy:
 *                 type: integer
 *               Extra1:
 *                 type: string
 *               Extra2:
 *                 type: string
 *               Extra3:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                     Name:
 *                       type: string
 *                     Wing:
 *                       type: string
 *                     RoomNo:
 *                       type: string
 *                     MobileNo:
 *                       type: string
 *                     EmailId:
 *                       type: string
 *                     Gender:
 *                       type: string
 *                     AadharImagePath:
 *                       type: string
 *                     PermanentAddress:
 *                       type: string
 *                     PresentAddress:
 *                       type: string
 *                     Location:
 *                       type: string
 *                     ProfileImagePath:
 *                       type: string
 *                     DOB:
 *                       type: dateonly
 *                       format: date
 *                     IsTrainer:
 *                       type: boolean
 *                     CreatedBy:
 *                       type: integer
 *                     CreatedDate:
 *                       type: date
 *                       format: date-time
 *                     UpdatedBy:
 *                       type: integer
 *                     UpdatedDate:
 *                       type: date
 *                       format: date-time
 *                     Extra1:
 *                       type: string
 *                     Extra2:
 *                       type: string
 *                     Extra3:
 *                       type: string
 *                     TenantId:
 *                       type: integer
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put("/:tenantId/:userId", updateUser);

/**
 * @swagger
 * /users/{tenantId}/{userId}:
 *   delete:
 *     summary: Delete user by tenant ID and user ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to identify the user.
 *         schema:
 *           type: integer
 *       - name: Id
 *         in: path
 *         required: true
 *         description: User ID to delete the specific user.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:tenantId/:userId", deleteUser);

/**
 * @swagger
 * /users/formatted/{tenantId}:
 *   get:
 *     summary: Get formatted users by tenant ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to filter users.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of formatted users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   formattedName:
 *                     type: string
 *                     example: "John Doe | 1234567890"
 *       404:
 *         description: No users found.
 *       500:
 *         description: Server error.
 */
router.get("/formatted/:tenantId", getFormattedUsersByTenantId);

module.exports = router;
