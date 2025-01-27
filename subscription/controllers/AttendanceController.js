const Attendance = require("../models/Attendance");
const { Sequelize } = require("sequelize");

// Get all attendances
exports.getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      attributes: [
        "Id",
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
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Format response
    const formattedAttendances = attendances.map((attendance) => {
      const formatDateTime = (dateTime) =>
        dateTime
          ? new Date(dateTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null;

      return {
        Id: attendance.Id,
        UserId: attendance.UserId,
        UserName: attendance.User?.FullName || null,
        CheckIn: formatDateTime(attendance.CheckIn),
        CheckOut: formatDateTime(attendance.CheckOut),
        CheckInBy: attendance.CheckInBy,
        CheckInByName: attendance.CheckInByUser?.FullName || null,
        CheckInDate: formatDateTime(attendance.CheckInDate),
        CheckOutBy: attendance.CheckOutBy,
        CheckOutByName: attendance.CheckOutByUser?.FullName || null,
        CheckOutDate: formatDateTime(attendance.CheckOutDate),
      };
    });

    res.status(200).json(formattedAttendances);
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

const { Op, fn, col } = require("sequelize");

exports.addAttendance = async (req, res) => {
  const { UserId, tenantId, CheckInBy, CheckOutBy } = req.body;

  if (!UserId) {
    return res.status(400).json({ error: "UserId is required." });
  }

  try {
    // Get today's date and format it as yyyy-MM-dd HH:mm:ss
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Logging the date values for debugging
    console.log("Start of Day:", startOfDay.toISOString());
    console.log("End of Day:", endOfDay.toISOString());

    // Use Sequelize's fn for date comparison to handle the conversion automatically
    const existingAttendance = await Attendance.findOne({
      where: {
        UserId,
        tenantId,
        CheckInDate: {
          [Op.between]: [
            fn("CONVERT", fn("datetime", startOfDay), "datetime"),
            fn("CONVERT", fn("datetime", endOfDay), "datetime"),
          ], // Converting dates into datetime format using Sequelize fn
        },
      },
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: "User has already checked in or checked out today." });
    }

    // Initialize CheckIn and CheckInDate with current date and time if CheckInBy is provided
    let finalCheckIn = null;
    let finalCheckInDate = null;
    let finalCheckOut = null;
    let finalCheckOutDate = null;

    if (CheckInBy) {
      finalCheckIn = new Date(); // Set current date/time if CheckInBy is provided
      finalCheckInDate = new Date(); // Set current date if CheckInBy is provided
    }
    if (CheckOutBy) {
      finalCheckOut = new Date(); // Set current date/time if CheckOutBy is provided
      finalCheckOutDate = new Date(); // Set current date if CheckOutBy is provided
    }

    // Add attendance record
    const newAttendance = await Attendance.create({
      UserId,
      tenantId,
      CheckIn: finalCheckIn || null,
      CheckOut: finalCheckOut || null, // Assuming CheckOut is optional and can be null initially
      CheckInBy,
      CheckInDate: finalCheckInDate,
      CheckOutBy, // Assuming CheckOutBy is optional and can be null initially
      CheckOutDate: finalCheckOutDate || null, // Assuming CheckOutDate is optional and can be null initially
    });

    res.status(201).json({
      message: "Attendance record created successfully.",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ error: error.message });
  }
};
