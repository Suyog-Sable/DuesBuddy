const express = require("express");
const {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  validateTenantCredentials,
} = require("../controllers/TenantController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: API endpoints for managing tenants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       required:
 *         - FullName
 *         - EmailId
 *         - MobileNo
 *         - Location
 *         - Password
 *       properties:
 *         FullName:
 *           type: string
 *           description: Full name of the tenant
 *         EmailId:
 *           type: string
 *           format: email
 *           description: Email address of the tenant
 *         MobileNo:
 *           type: string
 *           description: Mobile number of the tenant
 *         Location:
 *           type: string
 *           description: Address/location of the tenant
 *         Password:
 *           type: string
 *           description: Password for the tenant
 *       example:
 *         FullName: "John Doe"
 *         EmailId: "johndoe@example.com"
 *         MobileNo: "9876543210"
 *         Location: "New York, USA"
 *         Password: "password123"
 */

/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       500:
 *         description: Server error
 */
router.post("/tenants", createTenant);

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: Get all tenants
 *     tags: [Tenants]
 *     responses:
 *       200:
 *         description: List of all tenants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tenant'
 *       500:
 *         description: Server error
 */
router.get("/tenants", getAllTenants);

/**
 * @swagger
 * /tenants/{id}:
 *   get:
 *     summary: Get a tenant by ID
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Tenant found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.get("/tenants/:id", getTenantById);

/**
 * @swagger
 * /tenants/{id}:
 *   put:
 *     summary: Update a tenant by ID
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tenant'
 *     responses:
 *       200:
 *         description: Tenant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.put("/tenants/:id", updateTenant);

/**
 * @swagger
 * /tenants/{id}:
 *   delete:
 *     summary: Delete a tenant by ID
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tenant ID
 *     responses:
 *       204:
 *         description: Tenant deleted successfully
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.delete("/tenants/:id", deleteTenant);

/**
 * @swagger
 * /tenants/validate:
 *   post:
 *     summary: Authenticate a tenant using EmailId and Password
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - EmailId
 *               - Password
 *             properties:
 *               EmailId:
 *                 type: string
 *                 description: Registered Email ID
 *               Password:
 *                 type: string
 *                 description: Password for the tenant
 *             example:
 *               EmailId: "johndoe@example.com"
 *               Password: "password123"
 *     responses:
 *       200:
 *         description: Authentication successful, returns tenant object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/tenants/validate", validateTenantCredentials);

module.exports = router;
