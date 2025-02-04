const Tenant = require("../models/tenant");
const PaymentHistory = require("../models/PaymentHistory");
const UserSubscriptionPlanMapping = require("../models/UserSubscriptionPlanMapping");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const moment = require("moment-timezone");

// const moment = require("moment");
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
      return res.status(404).json({ message: "Payment History not found." });
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

        // PaymentDate: new Date(payment.PaymentDate).toLocaleString("en-US", {
        //   timeZone: "Asia/Kolkata",
        // }),
        PaymentDate: moment
          .utc(payment.PaymentDate)
          // .tz("Asia/Kolkata", true)
          .format("DD MMM YYYY HH:mm:ss"),
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

// exports.createPaymentHistory = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         console.error("Error during file upload:", err);
//         return res.status(400).json({ error: err.message });
//       }

//       const {
//         UserId,
//         tenantId,
//         SubscriptionPlanId,
//         TransactionRefId,
//         AmountReceived,
//         PaymentType,
//         PaymentDate,
//         CreatedBy,
//       } = req.body;

//       // Validate required fields
//       const requiredFields = [
//         "UserId",
//         "SubscriptionPlanId",
//         "TransactionRefId",
//         "AmountReceived",
//         "PaymentType",
//         "PaymentDate",
//       ];

//       const missingFields = requiredFields.filter((field) => !req.body[field]);
//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           error: `Missing required fields: ${missingFields.join(", ")}`,
//         });
//       }
//       // const paymentDate = moment(PaymentDate).format("YYYY-MM-DD HH:mm:ss");
//       // //Validate and format PaymentDate
//       // let paymentDateValue = null;
//       // if (
//       //   moment(PaymentDate, moment.ISO_8601, true).isValid() ||
//       //   moment(PaymentDate, "YYYY-MM-DD HH:mm:ss", true).isValid()
//       // ) {
//       //   paymentDateValue = moment(PaymentDate).format("YYYY-MM-DD HH:mm:ss");
//       // } else {
//       //   return res.status(400).json({
//       //     error: "Invalid PaymentDate format. Use 'YYYY-MM-DD HH:mm:ss'.",
//       //   });
//       // }

//       const paymentDate = moment
//         .utc(PaymentDate)
//         .format("DD MMM YYYY HH:mm:ss"); // moment(PaymentDate).format("YYYY-MM-DD");
//       // const paymentDate = new Date("2025-01-28T09:21:22.000Z"); // Sample ISO string
//       // const formattedPaymentDate = paymentDate
//       //   .toISOString()
//       //   .slice(0, 19)
//       //   .replace("T", " "); // Format to 'YYYY-MM-DD HH:mm:ss'
//       // console.log("Formatted Payment Date", formattedPaymentDate); // Output will be '2025-01-28 09:21:22'

//       // Handle optional image upload for PaymentType "O"
//       let paymentReceiptUrl = null;
//       if (PaymentType === "O") {
//         if (!req.files || !req.files.imagePath) {
//           return res.status(400).json({
//             error: "ImagePath is required when PaymentType is 'O'.",
//           });
//         }

//         const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
//         const uploadsUrl = `${process.env.UPLOADS_URL}/users`.replace(
//           /\\/g,
//           "/"
//         );
//         const userFolder = path.join(uploadsDir, String(UserId));

//         // Ensure user folder exists
//         if (!fs.existsSync(userFolder)) {
//           fs.mkdirSync(userFolder, { recursive: true });
//         }

//         const tempFilePath = path.join(
//           req.tempFolder,
//           req.files.imagePath[0].filename
//         );
//         const paymentReceiptPath = path.join(
//           userFolder,
//           req.files.imagePath[0].filename
//         );

//         // Move the file and clean up temp folder
//         await fs.promises.rename(tempFilePath, paymentReceiptPath);
//         await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

//         // Construct file URL
//         paymentReceiptUrl = `${uploadsUrl}/${UserId}/${req.files.imagePath[0].filename}`;
//       }

//       // Prepare data for database insertion
//       const newPaymentData = {
//         UserId,
//         tenantId,
//         SubscriptionPlanId,
//         TransactionRefId,
//         AmountReceived,
//         PaymentType,
//         PaymentDate: paymentDate,
//         // new Date(PaymentDate).toLocaleDateString("en-GB", {
//         //   day: "2-digit",
//         //   month: "short",
//         //   year: "numeric",
//         //   hour: "2-digit",
//         //   minute: "2-digit",
//         //   second: "2-digit",
//         // }),
//         CreatedBy,
//         CreatedDate: new Date(),
//         UpdatedDate: new Date(),
//         imagePath: paymentReceiptUrl,
//       };

//       // Create the payment record
//       const newPayment = await PaymentHistory.create(newPaymentData);

//       return res.status(201).json(newPayment);
//     });
//   } catch (error) {
//     console.error("Error creating payment record:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

//Harshali ma'am code
// exports.createPaymentHistory = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         console.error("Error during file upload:", err);
//         return res.status(400).json({ error: err.message });
//       }

//       const {
//         UserId,
//         tenantId,
//         SubscriptionPlanId,
//         TransactionRefId,
//         AmountReceived,
//         PaymentType,
//         PaymentDate,
//         CreatedBy,
//       } = req.body;

//       // Validate required fields
//       const requiredFields = [
//         "UserId",
//         "SubscriptionPlanId",
//         "TransactionRefId",
//         "AmountReceived",
//         "PaymentType",
//         "PaymentDate",
//       ];

//       const missingFields = requiredFields.filter((field) => !req.body[field]);
//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           error: `Missing required fields: ${missingFields.join(", ")}`,
//         });
//       }
//       console.log("Payment Date", PaymentDate);
//       // Store PaymentDate as UTC without conversion

//       // if (moment(PaymentDate, moment.ISO_8601, true).isValid()) {
//       //   // Parse ISO 8601 format
//       //   formattedPaymentDate = moment(PaymentDate).toDate(); // Convert to JavaScript Date object
//       // } else if (moment(PaymentDate, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
//       //   // Parse strictly formatted YYYY-MM-DD
//       //   formattedPaymentDate = moment(
//       //     PaymentDate,
//       //     "YYYY-MM-DD HH:mm:ss"
//       //   ).toDate();
//       // } else {
//       //   return res.status(400).json({
//       //     message:
//       //       "Invalid PaymentDate format. Use 'YYYY-MM-DD HH:mm:ss' or ISO 8601.",
//       //   });
//       // }
//       // const paymentDateUTC = new Date(PaymentDate); //moment(PaymentDate).format("YYYY-MM-DD HH:mm:ss");
//       // console.log("converted date", paymentDateUTC);
//       // Handle optional image upload for PaymentType "O"
//       let paymentReceiptUrl = null;
//       if (PaymentType === "O") {
//         if (!req.files || !req.files.imagePath) {
//           return res.status(400).json({
//             error: "ImagePath is required when PaymentType is 'O'.",
//           });
//         }

//         const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
//         const uploadsUrl = `${process.env.UPLOADS_URL}/users`.replace(
//           /\\/g,
//           "/"
//         );
//         const userFolder = path.join(uploadsDir, String(UserId));

//         // Ensure user folder exists
//         if (!fs.existsSync(userFolder)) {
//           fs.mkdirSync(userFolder, { recursive: true });
//         }

//         const tempFilePath = path.join(
//           req.tempFolder,
//           req.files.imagePath[0].filename
//         );
//         const paymentReceiptPath = path.join(
//           userFolder,
//           req.files.imagePath[0].filename
//         );

//         // Move the file and clean up temp folder
//         await fs.promises.rename(tempFilePath, paymentReceiptPath);
//         await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

//         // Construct file URL
//         paymentReceiptUrl = `${uploadsUrl}/${UserId}/${req.files.imagePath[0].filename}`;
//       }

//       // Prepare data for database insertion
//       const newPaymentData = {
//         UserId,
//         tenantId,
//         SubscriptionPlanId,
//         TransactionRefId,
//         AmountReceived,
//         PaymentType,

//         PaymentDate: new Date(PaymentDate), //formattedPaymentDate,
//         CreatedBy,
//         CreatedDate: moment().format("YYYY-MM-DD"),
//         UpdatedDate: moment().format("YYYY-MM-DD"),
//         imagePath: paymentReceiptUrl,
//       };
//       console.log("new payment", newPaymentData);
//       // Create the payment record
//       const newPayment = await PaymentHistory.create(newPaymentData);

//       return res.status(201).json(newPayment);
//     });
//   } catch (error) {
//     console.error("Error creating payment record:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// Suyog Sable

exports.createPaymentHistory = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(400).json({ error: err.message });
      }

      const {
        UserId,
        tenantId,
        SubscriptionPlanId,
        TransactionRefId,
        AmountReceived,
        PaymentType,
      } = req.body;

      const requiredFields = [
        "UserId",
        "SubscriptionPlanId",
        "TransactionRefId",
        "AmountReceived",
        "PaymentType",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Fetch previous payments sum
      const totalPaid = await PaymentHistory.sum("AmountReceived", {
        where: {
          UserId,
          SubscriptionPlanId,
          tenantId,
        },
      });
      console.log("Total Amount paid", totalPaid);
      // Fetch Subscription Plan Price
      const subscription = await UserSubscriptionPlanMapping.findOne({
        where: {
          UserId,
          Id: SubscriptionPlanId,
          tenantId,
        },
        attributes: ["Price"],
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found." });
      }

      const price = subscription.Price;
      const pendingAmount = price - (totalPaid || 0); // Handle case when no previous payments

      if (AmountReceived > pendingAmount) {
        return res.status(400).json({
          error: `Amount received exceeds pending amount. Pending amount: ${pendingAmount}`,
        });
      }

      // Get the current IST time
      const formattedPaymentDate = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      let paymentReceiptUrl = null;
      if (PaymentType === "O") {
        if (!req.files || !req.files.imagePath) {
          return res.status(400).json({
            error: "ImagePath is required when PaymentType is 'O'.",
          });
        }

        const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
        const uploadsUrl = `${process.env.UPLOADS_URL}/users`.replace(
          /\\/g,
          "/"
        );
        const userFolder = path.join(uploadsDir, String(UserId));

        if (!fs.existsSync(userFolder)) {
          fs.mkdirSync(userFolder, { recursive: true });
        }

        const tempFilePath = path.join(
          req.tempFolder,
          req.files.imagePath[0].filename
        );
        const paymentReceiptPath = path.join(
          userFolder,
          req.files.imagePath[0].filename
        );

        await fs.promises.rename(tempFilePath, paymentReceiptPath);
        await fs.promises.rm(req.tempFolder, { recursive: true, force: true });

        paymentReceiptUrl = `${uploadsUrl}/${UserId}/${req.files.imagePath[0].filename}`;
      }

      // Prepare data for database insertion
      const newPaymentData = {
        UserId,
        tenantId,
        SubscriptionPlanId,
        TransactionRefId,
        AmountReceived,
        PaymentType,
        PaymentDate: formattedPaymentDate,
        CreatedDate: moment().tz("Asia/Kolkata").toISOString(),
        UpdatedDate: moment().tz("Asia/Kolkata").toISOString(),
        imagePath: paymentReceiptUrl,
      };

      // Create the payment record
      const newPayment = await PaymentHistory.create(newPaymentData);

      return res.status(201).json(newPayment);
    });
  } catch (error) {
    console.error("Error creating payment record:", error);
    return res.status(500).json({ error: error.message });
  }
};

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
        // UpdatedBy,
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
      // payment.UpdatedBy = UpdatedBy || payment.UpdatedBy;
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
