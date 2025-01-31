const express = require("express");
const {
  getAllAttendances,
  addAttendance,
} = require("../controllers/AttendanceController");
const router = express.Router();

/**
 * @swagger
 * /attendance/{tenantId}:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get all attendance records by tenant ID
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to fetch attendance records.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of attendance records.
 *       404:
 *         description: No attendance records found.
 *       500:
 *         description: Server error.
 */
router.get("/:tenantId", getAllAttendances);

/**
 * @swagger
 * /attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Create a new attendance record
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: Tenant ID to fetch attendance records.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: integer
 *                 description: Tenant ID associated with the attendance record.
 *                 example: T001
 *               UserId:
 *                 type: integer
 *                 description: ID of the user associated with attendance.
 *                 example: 101
 *               CheckInBy:
 *                 type: integer
 *                 description: ID of the user who checked in the record.
 *                 example: 1
 *               CheckOutBy:
 *                 type: integer
 *                 description: ID of the user who checked out the record.
 *                 example: 2
 *     responses:
 *       201:
 *         description: Attendance record created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */
router.post("/", addAttendance);

module.exports = router;
