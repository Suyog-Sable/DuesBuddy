const express = require("express");
const {
  getPaymentHistoryByTenantId,
  createPaymentHistory,
  updatePaymentHistory,
  deletePaymentHistory,
} = require("../controllers/PaymentHistoryController");
const router = express.Router();

/**
 * @swagger
 * /payment-history/{tenantId}:
 *   get:
 *     tags:
 *       - PaymentHistory
 *     summary: Get all payment history records by tenant ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to fetch payment history.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of payment history records.
 *       404:
 *         description: No payment history found.
 *       500:
 *         description: Server error.
 */
router.get("/:tenantId", getPaymentHistoryByTenantId);

/**
 * @swagger
 * /payment-history:
 *   post:
 *     tags:
 *       - PaymentHistory
 *     summary: Create a new payment record
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to fetch payment history.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *                 description: Tenant ID associated with the payment record.
 *                 example: T001
 *               UserId:
 *                 type: integer
 *                 description: ID of the user associated with the payment.
 *                 example: 101
 *               SubscriptionPlanId:
 *                 type: integer
 *                 description: ID of the subscription plan.
 *                 example: 202
 *               TransactionRefId:
 *                 type: string
 *                 description: Reference ID for the transaction.
 *                 example: TXN12345
 *               AmountReceived:
 *                 type: integer
 *                 description: Amount received in the payment.
 *                 example: 500
 *               PaymentType:
 *                 type: string
 *                 description: Type of payment (e.g., C for Cash, O for Online).
 *                 example: O
 *               imagePath:
 *                 type: string
 *                 format: binary
 *                 description: Path to the payment proof image.
 *                 example: /images/payments/txn12345.jpg
 *               PaymentDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date of payment.
 *               CreatedBy:
 *                 type: integer
 *                 description: ID of the user who created the record.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Payment record created successfully.
 *       500:
 *         description: Server error.
 */
router.post("/", createPaymentHistory);

/**
 * @swagger
 * /payment-history/{tenantId}/{paymentId}:
 *   put:
 *     tags:
 *       - PaymentHistory
 *     summary: Update an existing payment record
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID for filtering the payment record.
 *       - name: paymentId
 *         in: path
 *         required: true
 *         description: Payment record ID to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               UserId:
 *                 type: integer
 *               SubscriptionPlanId:
 *                 type: integer
 *               TransactionRefId:
 *                 type: string
 *               AmountReceived:
 *                 type: integer
 *               PaymentType:
 *                 type: string
 *               imagePath:
 *                 type: string
 *                 format: binary
 *               PaymentDate:
 *                 type: string
 *                 format: date
 *               UpdatedBy:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Payment record updated successfully.
 *       404:
 *         description: Payment record not found.
 *       500:
 *         description: Server error.
 */
router.put("/:tenantId/:paymentId", updatePaymentHistory);

/**
 * @swagger
 * /payment-history/{tenantId}/{paymentId}:
 *   delete:
 *     tags:
 *       - PaymentHistory
 *     summary: Delete a payment record
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID for filtering the payment records.
 *       - name: paymentId
 *         in: path
 *         required: true
 *         description: Payment record ID to delete.
 *     responses:
 *       200:
 *         description: Payment record deleted successfully.
 *       404:
 *         description: Payment record not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:tenantId/:paymentId", deletePaymentHistory);

module.exports = router;
