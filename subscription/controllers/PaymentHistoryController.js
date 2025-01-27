const Tenant = require("../models/tenant");
const PaymentHistory = require("../models/PaymentHistory");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const upload = require("../middleware/upload");
// Get payment history by tenant ID
exports.getPaymentHistoryByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: PaymentHistory,
          attributes: [
            "Id",
            "UserId",
            "SubscriptionPlanId",
            "TransactionRefId",
            "AmountReceived",
            "PaymentType",
            "imagePath",
            "PaymentDate",
            "CreatedBy",
            "CreatedDate",
            "UpdatedBy",
            "UpdatedDate",
          ],
          required: true,
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const response = {
      tenantId: tenant.Id,
      Email: tenant.Email,
      PaymentHistory: tenant.PaymentHistories.map((payment) => ({
        Id: payment.Id,
        UserId: payment.UserId,
        SubscriptionPlanId: payment.SubscriptionPlanId,
        TransactionRefId: payment.TransactionRefId,
        AmountReceived: payment.AmountReceived,
        PaymentType: payment.PaymentType,
        imagePath: payment.imagePath,
        PaymentDate: payment.PaymentDate,
        CreatedBy: payment.CreatedBy,
        CreatedDate: payment.CreatedDate,
        UpdatedBy: payment.UpdatedBy,
        UpdatedDate: payment.UpdatedDate,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new payment record
// exports.createPaymentHistory = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         console.error("Error during file upload:", err);
//         return res.status(400).json({ error: err.message });
//       }

//       const paymentData = {
//         UserId: req.body.UserId,
//         tenantId: req.body.tenantId,
//         SubscriptionPlanId: req.body.SubscriptionPlanId,
//         TransactionRefId: req.body.TransactionRefId,
//         AmountReceived: req.body.AmountReceived,
//         PaymentType: req.body.PaymentType,
//         PaymentDate: new Date(req.body.PaymentDate),
//         CreatedBy: req.body.CreatedBy,
//       };

//       // Validate required fields
//       const requiredFields = [
//         "UserId",
//         "SubscriptionPlanId",
//         "TransactionRefId",
//         "AmountReceived",
//         "PaymentType",
//         "PaymentDate",
//       ];

//       const missingFields = requiredFields.filter(
//         (field) => !paymentData[field]
//       );

//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           error: `Missing required fields: ${missingFields.join(", ")}`,
//         });
//       }

//       // File upload logic
//       let paymentReceiptUrl = null;

//       if (paymentData.PaymentType === "O") {
//         // Only proceed with file upload if PaymentType is "O"
//         if (!req.files || !req.files.imagePath) {
//           return res.status(400).json({
//             error: "ImagePath is required when PaymentType is 'O'.",
//           });
//         }

//         // Handle the file upload
//         const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
//         // const uploadsUrl = process.env.UPLOADS_URL; // Web URL
//         const uploadsUrl = `${process.env.UPLOADS_URL}/users/`.replace(
//           /\\/g,
//           "/"
//         );
//         const userFolder = path.join(uploadsDir, String(req.body.UserId));

//         // Ensure the user folder exists
//         if (!fs.existsSync(userFolder)) {
//           try {
//             fs.mkdirSync(userFolder, { recursive: true });
//           } catch (err) {
//             console.error("Error creating user folder:", err);
//             return res
//               .status(500)
//               .json({ error: "Error creating user folder." });
//           }
//         }

//         const tempFilePath = path.join(
//           req.tempFolder,
//           req.files.imagePath[0].filename
//         );
//         const paymentReceiptPath = path.join(
//           userFolder,
//           req.files.imagePath[0].filename
//         );

//         // Move the file from the temp folder to the user folder
//         await fs.promises.rename(tempFilePath, paymentReceiptPath);
//         await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

//         // Construct the file URL to store in DB
//         paymentReceiptUrl = `${uploadsUrl}${req.body.UserId}/${req.files.imagePath[0].filename}`;
//       }

//       // Validate PaymentType and ImagePath for "O"
//       if (paymentData.PaymentType === "O" && !paymentReceiptUrl) {
//         return res.status(400).json({
//           error: "ImagePath is required when PaymentType is 'O'.",
//         });
//       }

//       // Validate PaymentDate format
//       const paymentDateValue = new Date(req.body.PaymentDate);
//       if (isNaN(paymentDateValue.getTime())) {
//         return res.status(400).json({ error: "Invalid Payment Date format." });
//       }

//       const createdDate = new Date();
//       const updatedDate = new Date();
//       const revisedData = {
//         UserId: req.body.UserId,
//         tenantId: req.body.tenantId,
//         SubscriptionPlanId: req.body.SubscriptionPlanId,
//         TransactionRefId: req.body.TransactionRefId,
//         AmountReceived: req.body.AmountReceived,
//         PaymentType: req.body.PaymentType,
//         PaymentDate: paymentDateValue,
//         CreatedBy: req.body.CreatedBy,
//         CreatedDate: createdDate,
//         UpdatedDate: updatedDate,
//         imagePath: paymentReceiptUrl, // Only included if "O"
//       };

//       const newPayment = await PaymentHistory.create(revisedData);

//       res.status(201).json(newPayment);
//     });
//   } catch (error) {
//     console.error("Error creating payment record:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createPaymentHistory = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(400).json({ error: err.message });
      }

      const paymentData = {
        UserId: req.body.UserId,
        tenantId: req.body.tenantId,
        SubscriptionPlanId: req.body.SubscriptionPlanId,
        TransactionRefId: req.body.TransactionRefId,
        AmountReceived: req.body.AmountReceived,
        PaymentType: req.body.PaymentType,
        PaymentDate: req.body.PaymentDate, // Raw input for validation
        CreatedBy: req.body.CreatedBy,
      };

      // Validate required fields
      const requiredFields = [
        "UserId",
        "SubscriptionPlanId",
        "TransactionRefId",
        "AmountReceived",
        "PaymentType",
        "PaymentDate",
      ];

      const missingFields = requiredFields.filter(
        (field) => !paymentData[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Parse and validate PaymentDate
      const paymentDateValue = new Date(paymentData.PaymentDate);
      if (isNaN(paymentDateValue.getTime())) {
        return res.status(400).json({
          error:
            "Invalid Payment Date format. Provide in ISO 8601 format (YYYY-MM-DDTHH:mm:ss).",
        });
      }

      // File upload logic
      let paymentReceiptUrl = null;

      if (paymentData.PaymentType === "O") {
        // Only proceed with file upload if PaymentType is "O"
        if (!req.files || !req.files.imagePath) {
          return res.status(400).json({
            error: "ImagePath is required when PaymentType is 'O'.",
          });
        }

        // Handle the file upload
        const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
        const uploadsUrl = `${process.env.UPLOADS_URL}/users/`.replace(
          /\\/g,
          "/"
        );
        const userFolder = path.join(uploadsDir, String(req.body.UserId));

        // Ensure the user folder exists
        if (!fs.existsSync(userFolder)) {
          try {
            fs.mkdirSync(userFolder, { recursive: true });
          } catch (err) {
            console.error("Error creating user folder:", err);
            return res
              .status(500)
              .json({ error: "Error creating user folder." });
          }
        }

        const tempFilePath = path.join(
          req.tempFolder,
          req.files.imagePath[0].filename
        );
        const paymentReceiptPath = path.join(
          userFolder,
          req.files.imagePath[0].filename
        );

        // Move the file from the temp folder to the user folder
        await fs.promises.rename(tempFilePath, paymentReceiptPath);
        await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

        // Construct the file URL to store in DB
        paymentReceiptUrl = `${uploadsUrl}/users/${req.body.UserId}/${req.files.imagePath[0].filename}`;
      }

      // Validate PaymentType and ImagePath for "O"
      if (paymentData.PaymentType === "O" && !paymentReceiptUrl) {
        return res.status(400).json({
          error: "ImagePath is required when PaymentType is 'O'.",
        });
      }

      // Add timestamps
      const createdDate = new Date();
      const updatedDate = new Date();

      // Prepare data for database insertion
      const revisedData = {
        UserId: paymentData.UserId,
        tenantId: paymentData.tenantId,
        SubscriptionPlanId: paymentData.SubscriptionPlanId,
        TransactionRefId: paymentData.TransactionRefId,
        AmountReceived: paymentData.AmountReceived,
        PaymentType: paymentData.PaymentType,
        PaymentDate: paymentDateValue, // Ensures date and time are stored
        CreatedBy: paymentData.CreatedBy,
        CreatedDate: createdDate,
        UpdatedDate: updatedDate,
        imagePath: paymentReceiptUrl, // Only included if "O"
      };

      // Create the payment record in the database
      const newPayment = await PaymentHistory.create(revisedData);

      res.status(201).json(newPayment);
    });
  } catch (error) {
    console.error("Error creating payment record:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing payment record
exports.updatePaymentHistory = async (req, res) => {
  try {
    const { tenantId, paymentId } = req.params;

    upload(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(400).json({ error: err.message });
      }

      const {
        UserId,
        SubscriptionPlanId,
        TransactionRefId,
        AmountReceived,
        PaymentType,
        PaymentDate,
        UpdatedBy,
      } = req.body;

      const payment = await PaymentHistory.findOne({
        where: { tenantId: tenantId, Id: paymentId },
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found." });
      }

      let paymentReceiptUrl = payment.imagePath;

      // Handle file upload if PaymentType is "O"
      if (PaymentType === "O") {
        if (!req.files || !req.files.imagePath) {
          return res.status(400).json({
            error: "ImagePath is required when PaymentType is 'O'.",
          });
        }

        const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
        const uploadsUrl = `${process.env.UPLOADS_URL}/users/`.replace(
          /\\/g,
          "/"
        );
        const userFolder = path.join(uploadsDir, String(payment.UserId));

        // Ensure the user folder exists
        if (!fs.existsSync(userFolder)) {
          try {
            fs.mkdirSync(userFolder, { recursive: true });
          } catch (err) {
            console.error("Error creating user folder:", err);
            return res
              .status(500)
              .json({ error: "Error creating user folder." });
          }
        }

        const tempFilePath = path.join(
          req.tempFolder,
          req.files.imagePath[0].filename
        );
        const paymentReceiptPath = path.join(
          userFolder,
          req.files.imagePath[0].filename
        );

        // Move the file from the temp folder to the user folder
        await fs.promises.rename(tempFilePath, paymentReceiptPath);
        await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

        // Construct the file URL to store in DB
        paymentReceiptUrl = `${uploadsUrl}${payment.UserId}/${req.files.imagePath[0].filename}`;
      }

      // Validate PaymentDate format
      const paymentDateValue = PaymentDate
        ? new Date(PaymentDate)
        : payment.PaymentDate;
      if (PaymentDate && isNaN(paymentDateValue.getTime())) {
        return res.status(400).json({ error: "Invalid Payment Date format." });
      }

      // Update payment record fields
      payment.UserId = UserId || payment.UserId;
      payment.SubscriptionPlanId =
        SubscriptionPlanId || payment.SubscriptionPlanId;
      payment.TransactionRefId = TransactionRefId || payment.TransactionRefId;
      payment.AmountReceived = AmountReceived || payment.AmountReceived;
      payment.PaymentType = PaymentType || payment.PaymentType;
      payment.imagePath = paymentReceiptUrl || payment.imagePath;
      payment.PaymentDate = paymentDateValue;
      payment.UpdatedBy = UpdatedBy || payment.UpdatedBy;
      payment.UpdatedDate = new Date();

      await payment.save();

      res.status(200).json(payment);
    });
  } catch (error) {
    console.error("Error updating payment record:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment record
exports.deletePaymentHistory = async (req, res) => {
  try {
    const { tenantId, paymentId } = req.params;

    const payment = await PaymentHistory.findOne({
      where: { tenantId: tenantId, Id: paymentId },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    await payment.destroy();

    res.status(200).json({ message: "Payment record deleted successfully." });
  } catch (error) {
    console.error("Error deleting payment record:", error);
    res.status(500).json({ error: error.message });
  }
};
