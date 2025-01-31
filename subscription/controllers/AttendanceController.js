const Attendance = require("../models/Attendance");
const { Sequelize } = require("sequelize");
const moment = require("moment");

// Get all attendances

// exports.getAllAttendances = async (req, res) => {
//   try {
//     const attendances = await Attendance.findAll({
//       attributes: [
//         "Id",
//         "tenantId",
//         "UserId",
//         "CheckIn",
//         "CheckOut",
//         "CheckInBy",
//         "CheckInDate",
//         "CheckOutBy",
//         "CheckOutDate",
//       ],
//     });

//     if (!attendances || attendances.length === 0) {
//       return res.status(404).json({ message: "No attendance records found." });
//     }

//     // Format response and convert time to the desired timezone
//     const formattedAttendances = attendances.map((attendance) => {
//       return {
//         Id: attendance.Id,
//         UserId: attendance.UserId,
//         tenantId: attendance.tenantId,
//         UserName: attendance.User?.FullName || null,
//         CheckIn: moment.utc(attendance.CheckIn).format("DD MMM YYYY HH:mm:ss"), // Local time conversion
//         CheckOut: attendance.CheckOut
//           ? moment.utc(attendance.CheckOut).format("DD MMM YYYY HH:mm:ss")
//           : null,
//         CheckInBy: attendance.CheckInBy,
//         CheckInByName: attendance.CheckInByUser?.FullName || null,
//         CheckInDate: moment
//           .utc(attendance.CheckInDate)
//           .format("DD MMM YYYY HH:mm:ss"),
//         CheckOutBy: attendance.CheckOutBy,
//         CheckOutByName: attendance.CheckOutByUser?.FullName || null,
//         CheckOutDate: attendance.CheckOutDate
//           ? moment.utc(attendance.CheckOutDate).format("DD MMM YYYY HH:mm:ss")
//           : null,
//       };
//     });

//     res.status(200).json(formattedAttendances);
//   } catch (error) {
//     console.error("Error fetching attendance records:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllAttendances = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Fetch attendance records for the specified tenant
    const attendances = await Attendance.findAll({
      where: { tenantId },
      attributes: [
        "Id",
        "tenantId",
        "UserId",
        "CheckIn",
        "CheckOut",
        "CheckInBy",
        "CheckInDate",
        "CheckOutBy",
        "CheckOutDate",
      ],
    });

    if (!attendances || attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this tenant." });
    }

    // Format response and convert time to the desired timezone
    const formattedAttendances = attendances.map((attendance) => ({
      Id: attendance.Id,
      UserId: attendance.UserId,
      tenantId: attendance.tenantId,
      UserName: attendance.User?.FullName || null,
      CheckIn: attendance.CheckIn
        ? moment.utc(attendance.CheckIn).format("DD MMM YYYY HH:mm:ss")
        : null,
      CheckOut: attendance.CheckOut
        ? moment.utc(attendance.CheckOut).format("DD MMM YYYY HH:mm:ss")
        : null,
      CheckInBy: attendance.CheckInBy,
      CheckInByName: attendance.CheckInByUser?.FullName || null,
      CheckInDate: attendance.CheckInDate
        ? moment.utc(attendance.CheckInDate).format("DD MMM YYYY HH:mm:ss")
        : null,
      CheckOutBy: attendance.CheckOutBy,
      CheckOutByName: attendance.CheckOutByUser?.FullName || null,
      CheckOutDate: attendance.CheckOutDate
        ? moment.utc(attendance.CheckOutDate).format("DD MMM YYYY HH:mm:ss")
        : null,
    }));

    res.status(200).json({ tenantId, attendances: formattedAttendances });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add attendance (CheckIn or CheckOut)
// exports.addAttendance = async (req, res) => {
//   const { UserId, tenantId, CheckInBy, CheckOutBy } = req.body;

//   if (!UserId) {
//     return res.status(400).json({ error: "UserId is required." });
//   }

//   try {
//     // Initialize CheckIn and CheckInDate with current date and time if CheckInBy is provided
//     let finalCheckIn = null;
//     let finalCheckInDate = null;
//     let finalCheckOut = null;
//     let finalCheckOutDate = null;

//     if (CheckInBy) {
//       finalCheckIn = new Date(); // Set current date/time if CheckInBy is provided
//       finalCheckInDate = new Date(); // Set current date if CheckInBy is provided
//     }
//     if (CheckOutBy) {
//       finalCheckOut = new Date(); // Set current date/time if CheckInBy is provided
//       finalCheckOutDate = new Date(); // Set current date if CheckInBy is provided
//     }

//     // Add attendance record
//     const newAttendance = await Attendance.create({
//       UserId,
//       tenantId,
//       CheckIn: finalCheckIn || null,
//       CheckOut: finalCheckOut || null, // Assuming CheckOut is optional and can be null initially
//       CheckInBy,
//       CheckInDate: finalCheckInDate,
//       CheckOutBy, // Assuming CheckOutBy is optional and can be null initially
//       CheckOutDate: finalCheckOutDate || null, // Assuming CheckOutDate is optional and can be null initially
//     });

//     res.status(201).json({
//       message: "Attendance record created successfully.",
//       attendance: newAttendance,
//     });
//   } catch (error) {
//     console.error("Error adding attendance:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.addAttendance = async (req, res) => {
  const { UserId, tenantId, CheckInBy, CheckOutBy } = req.body;

  try {
    // Validate input
    if (!UserId || (!CheckInBy && !CheckOutBy)) {
      return res.status(400).json({
        error: "UserId and either CheckInBy or CheckOutBy are required",
      });
    }

    // Get today's date for comparison
    const today = moment.utc().startOf("day").toDate();

    // Check if the user has already checked in today
    const existingAttendance = await Attendance.findOne({
      where: {
        UserId,
        tenantId,
        CheckIn: {
          [Sequelize.Op.gte]: today, // Ensure the check-in time is today or later
        },
      },
    });

    // If CheckOutBy is provided and the user has already checked in, update the CheckOut details
    if (existingAttendance && CheckOutBy) {
      if (existingAttendance.CheckOut) {
        return res
          .status(400)
          .json({ message: "You have already checked out today." });
      }
      // Update CheckOut details
      await existingAttendance.update({
        CheckOut: Sequelize.fn("GETDATE"),
        CheckOutBy,
        CheckOutDate: Sequelize.fn("GETDATE"),
      });
      return res.status(200).json({
        message: "CheckOut updated successfully",
        attendance: existingAttendance,
      });
    }

    // If no existing CheckIn, create a new CheckIn record
    if (!existingAttendance && CheckInBy) {
      const newAttendance = await Attendance.create({
        UserId,
        tenantId,
        CheckIn: Sequelize.fn("GETDATE"),
        CheckInBy,
        CheckInDate: Sequelize.fn("GETDATE"),
      });
      return res.status(201).json({
        message: "CheckIn added successfully",
        attendance: newAttendance,
      });
    }

    // If neither condition is met, return an error
    return res.status(400).json({
      message: "Already Checked In.",
    });
  } catch (error) {
    console.error("Error adding/updating attendance:", error);
    return res.status(500).json({ error: "Error adding/updating attendance" });
  }
};
