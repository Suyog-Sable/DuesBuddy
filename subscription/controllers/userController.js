const fs = require("fs"); // Import fs module for file system operations
const path = require("path"); // Import path module for handling file paths
const User = require("../models/user");
const Tenant = require("../models/tenant");
const moment = require("moment");
const UserSubscriptionPlanMapping = require("../models/UserSubscriptionPlanMapping");
const SubscriptionPlan = require("../models/subscriptionPlan");
const upload = require("../middleware/upload"); // Import your multer upload configuration
const PaymentHistory = require("../models/PaymentHistory");
const { Op, Sequelize } = require("sequelize");

// Suyog
// Handle user folder and image uploads

// const handleUserFolderAndImages = async (tempfolder, userId, files) => {
//   try {
//     const userFolder = path.join(
//       __dirname,
//       "..",
//       "uploads",
//       "users",
//       userId.toString()
//     );

//     // Create folder if it doesn't exist
//     if (!fs.existsSync(userFolder)) {
//       fs.mkdirSync(userFolder, { recursive: true });
//     }

//     if (files && files.length > 0) {
//       for (let file of files) {
//         const fileName = `${userId}_${file.originalname}`;
//         const newFilePath = path.join(userFolder, fileName);

//         // Move file to user folder
//         fs.renameSync(file.path, newFilePath);

//         // Update database with file paths
//         if (file.fieldname === "profileImage") {
//           await User.update(
//             { ProfileImagePath: newFilePath },
//             { where: { Id: userId } }
//           );
//         } else if (file.fieldname === "aadharImage") {
//           await User.update(
//             { AadharImagePath: newFilePath },
//             { where: { Id: userId } }
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error handling user images:", error);
//     throw new Error("Failed to process user images.");
//   }
// };
// Code---Harshali
async function handleUserFolderAndImages(tempFolder, userId, files, req) {
  const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
  const uploadsUrl = `${process.env.UPLOADS_URL}/users`.replace(/\\/g, "/");
  const userFolder = path.join(uploadsDir, String(userId));

  // Ensure the user folder exists
  if (!fs.existsSync(userFolder)) {
    try {
      fs.mkdirSync(userFolder, { recursive: true });
    } catch (err) {
      console.error("Error creating user folder:", err);
      return res.status(500).json({ error: "Error creating user folder." });
    }
  }

  // Move files from tempFolder to userFolder
  const moveFiles = (sourceDir, destDir) => {
    if (!fs.existsSync(sourceDir)) {
      throw new Error("Source directory does not exist.");
    }
    const files = fs.readdirSync(sourceDir);
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);
      fs.renameSync(sourceFile, destFile);
    });
  };

  // Move all files and delete the temp folder
  moveFiles(tempFolder, userFolder);
  fs.rmdirSync(tempFolder);

  // Helper function to convert file path to URL
  const convertToUrl = (filePath) => {
    const normalizedFilePath = path.normalize(filePath);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    return normalizedFilePath
      .replace(normalizedUploadsDir, uploadsUrl)
      .replace(/\\/g, "/");
  };

  // Prepare image paths with URL replacement
  const profileImagePath = files?.ProfileImagePath
    ? convertToUrl(path.join(userFolder, files.ProfileImagePath[0].filename))
    : null;

  const aadharImagePath = files?.AadharImagePath
    ? convertToUrl(path.join(userFolder, files.AadharImagePath[0].filename))
    : null;

  // Update the User table
  await User.update(
    {
      ProfileImagePath: profileImagePath,
      AadharImagePath: aadharImagePath,
    },
    {
      where: { Id: userId },
    }
  );
}

// Get Users by TenantId
exports.getUsersByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Fetch the tenant with its associated users
    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: User,
          required: true,
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const response = tenant.Users.map((user) => ({
      Id: user.Id,
      tenantId: user.tenantId,
      Name: user.Name,
      Wing: user.Wing,
      RoomNo: user.RoomNo,
      MobileNo: user.MobileNo,
      EmailId: user.EmailId,
      Gender: user.Gender,
      AadharImagePath: user.AadharImagePath,
      PermanentAddress: user.PermanentAddress,
      PresentAddress: user.PresentAddress,
      Location: user.Location,
      ProfileImagePath: user.ProfileImagePath,
      DOB: user.DOB,
      IsTrainer: user.IsTrainer,
      CreatedBy: user.CreatedBy,
      CreatedDate: user.CreatedDate,
      UpdatedBy: user.UpdatedBy,
      UpdatedDate: user.UpdatedDate,
      Extra1: user.Extra1,
      Extra2: user.Extra2,
      Extra3: user.Extra3,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching tenant and users:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get User by UserId and TenantId
exports.getUserByIdAndTenant = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;

    const user = await User.findOne({
      where: { TenantId: tenantId, Id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for this tenant." });
    }

    const response = {
      Id: user.Id,
      Name: user.Name,
      Wing: user.Wing,
      RoomNo: user.RoomNo,
      MobileNo: user.MobileNo,
      EmailId: user.EmailId,
      Gender: user.Gender,
      AadharImagePath: user.AadharImagePath,
      PermanentAddress: user.PermanentAddress,
      PresentAddress: user.PresentAddress,
      Location: user.Location,
      ProfileImagePath: user.ProfileImagePath,
      DOB: user.DOB,
      IsTrainer: user.IsTrainer,
      CreatedBy: user.CreatedBy,
      CreatedDate: user.CreatedDate,
      UpdatedBy: user.UpdatedBy,
      UpdatedDate: user.UpdatedDate,
      Extra1: user.Extra1,
      Extra2: user.Extra2,
      Extra3: user.Extra3,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user by tenant and user ID:", error);
    res.status(500).json({ error: error.message });
  }
};
// Create a new User for a specific TenantId

// Update User by UserId and TenantId

exports.createUser = async (req, res) => {
  try {
    // Process file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({
          message: "File upload failed.",
          error: err.message,
        });
      }

      const {
        Name,
        Wing,
        RoomNo,
        MobileNo,
        EmailId,
        Gender,
        DOB,
        IsTrainer,
        Location,
        CreatedBy,
        PermanentAddress,
        PresentAddress,
      } = req.body;

      // Extract tenantId from path parameters
      const { tenantId } = req.params;

      // Validate tenantId
      if (!tenantId) {
        return res.status(400).json({
          message: "tenantId is required in the path parameter.",
        });
      }

      // Check if tenant exists
      const tenant = await Tenant.findOne({ where: { Id: tenantId } });
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found." });
      }

      // Validate and format DOB
      let formattedDOB;
      if (moment(DOB, moment.ISO_8601, true).isValid()) {
        formattedDOB = moment(DOB).toDate();
      } else if (moment(DOB, "YYYY-MM-DD", true).isValid()) {
        formattedDOB = moment(DOB, "YYYY-MM-DD").toDate();
      } else {
        return res.status(400).json({
          message: "Invalid DOB format. Use 'YYYY-MM-DD' or ISO 8601.",
        });
      }

      let user; // Fix: Allow reassignment

      try {
        user = await User.create({
          tenantId,
          Name,
          Wing,
          RoomNo,
          MobileNo,
          EmailId,
          Gender,
          DOB: formattedDOB,
          IsTrainer,
          Location,
          CreatedBy: null,
          PermanentAddress,
          PresentAddress,
          profileImage: null, // Default to null if not provided
          adharImage: null, // Default to null if not provided
        });
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          const duplicateFields = error.errors.map((err) => ({
            field: err.path,
            message: `${err.path} must be unique.`,
          }));

          return res.status(400).json({
            message:
              "Validation error: Duplicate value for email or MobileNumber.",
            errors: duplicateFields,
          });
        }

        console.error("Error creating user:", error);
        return res.status(500).json({
          message: "An error occurred while creating the user.",
          error: error.message,
        });
      }

      // Handle file upload only if files exist
      if (req.files && Object.keys(req.files).length > 0) {
        const tempFolder = req.tempFolder;
        const files = req.files;
        await handleUserFolderAndImages(tempFolder, user.Id, files, req);
      }

      // Respond with success (fix: user object is now defined)
      return res.status(201).json({
        id: user.Id,
        name: user.Name,
        mobileNumber: user.MobileNo,
      });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "An error occurred while creating the user.",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const updatedData = req.body;

    // Convert userId to integer if necessary
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return res
        .status(400)
        .json({ message: "Invalid userId. Must be a number." });
    }

    // Find user
    const user = await User.findOne({
      where: { TenantId: tenantId, Id: numericUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Preserve existing ProfileImagePath and AadharImagePath if not provided
    updatedData.ProfileImagePath =
      updatedData.ProfileImagePath || user.ProfileImagePath;
    updatedData.AadharImagePath =
      updatedData.AadharImagePath || user.AadharImagePath;

    // ✅ Handle DOB conversion (prevent invalid date errors)
    if (updatedData.DOB) {
      if (moment(updatedData.DOB, moment.ISO_8601, true).isValid()) {
        updatedData.DOB = moment(updatedData.DOB).format("YYYY-MM-DD");
      } else if (moment(updatedData.DOB, "YYYY-MM-DD", true).isValid()) {
        updatedData.DOB = moment(updatedData.DOB, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
      } else {
        return res.status(400).json({
          message: "Invalid DOB format. Use 'YYYY-MM-DD' or ISO 8601.",
        });
      }
    }

    // Handle file uploads (if files exist)
    if (req.files && Object.keys(req.files).length > 0) {
      if (!req.tempFolder) {
        return res
          .status(400)
          .json({ message: "Temporary folder is missing." });
      }

      const tempFolder = req.tempFolder;
      const files = req.files;
      await handleUserFolderAndImages(tempFolder, numericUserId, files, req);

      // Assuming handleUserFolderAndImages updates file paths, re-fetch them
      updatedData.ProfileImagePath =
        files.profileImagePath || updatedData.ProfileImagePath;
      updatedData.AadharImagePath =
        files.aadharImagePath || updatedData.AadharImagePath;
    }

    // Update user data
    await user.update(updatedData);

    // Construct response
    const response = {
      Id: user.Id,
      tenantId: user.tenantId,
      Name: user.Name,
      Wing: user.Wing,
      RoomNo: user.RoomNo,
      MobileNo: user.MobileNo,
      EmailId: user.EmailId,
      Gender: user.Gender,
      AadharImagePath: user.AadharImagePath,
      PermanentAddress: user.PermanentAddress,
      PresentAddress: user.PresentAddress,
      Location: user.Location,
      ProfileImagePath: user.ProfileImagePath,
      DOB: user.DOB,
      IsTrainer: user.IsTrainer,
      CreatedBy: null,
      CreatedDate: user.CreatedDate,
      UpdatedBy: user.UpdatedBy,
      UpdatedDate: user.UpdatedDate,
      Extra1: user.Extra1,
      Extra2: user.Extra2,
      Extra3: user.Extra3,
    };

    res
      .status(200)
      .json({ message: "User updated successfully", user: response });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete User by UserId and TenantId
exports.deleteUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;

    const user = await User.findOne({
      where: { TenantId: tenantId, Id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get formatted users by tenant ID
exports.getFormattedUsersByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Fetch users for the given tenant
    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: User,
          required: true,
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = tenant.Users.map((user) => ({
      Id: user.Id,
      Name: ` ${user.Name} | ${user.MobileNo}`,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching formatted users:", error);
    res.status(500).json({ error: error.message });
  }
};

// get Active plans for users

// exports.getUserSubscriptionPlanDetails = async (req, res) => {
//   const { userId, tenantId } = req.params;

//   try {
//     // Check if the user has any subscriptions
//     const userSubscriptions = await UserSubscriptionPlanMapping.findAll({
//       where: {
//         UserId: userId,
//         TenantId: tenantId,
//       },
//     });

//     if (!userSubscriptions || userSubscriptions.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No subscriptions found for the user." });
//     }

//     // Fetch the subscription plan details for all subscriptions
//     const subscriptionPlans = await Promise.all(
//       userSubscriptions.map(async (userSubscription) => {
//         const subscriptionPlan = await SubscriptionPlan.findOne({
//           where: {
//             Id: userSubscription.SubscriptionPlanId,
//           },
//         });

//         return subscriptionPlan;
//       })
//     );

//     // Filter out null values in case no plan was found for some subscriptions
//     const validSubscriptionPlans = subscriptionPlans.filter(Boolean);

//     if (validSubscriptionPlans.length === 0) {
//       return res.status(404).json({ message: "Subscription plans not found." });
//     }

//     return res.status(200).json(validSubscriptionPlans);
//   } catch (error) {
//     console.error("Error fetching subscription plan details:", error);
//     return res.status(500).json({ message: "Internal server error.", error });
//   }
// };

exports.getUserSubscriptionPlanDetails = async (req, res) => {
  const { userId, tenantId } = req.params;

  try {
    // Retrieve all active subscriptions for the user
    const userSubscriptions = await UserSubscriptionPlanMapping.findAll({
      where: {
        UserId: userId,
        TenantId: tenantId,
        IsActive: true, // Fetch only active subscriptions
      },
      raw: true,
    });

    if (!userSubscriptions || userSubscriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No active subscriptions found for the user." });
    }

    // Fetch subscription plans where pending amount exists
    const subscriptionPlans = await Promise.all(
      userSubscriptions.map(async (userSubscription) => {
        // Sum of all AmountReceived for the given subscription
        const paymentData = await PaymentHistory.findAll({
          where: {
            UserId: userId,
            SubscriptionPlanId: userSubscription.Id, // Should be userSubscription.Id
            TenantId: tenantId,
          },
          attributes: [
            [Sequelize.fn("SUM", Sequelize.col("AmountReceived")), "totalPaid"],
          ],
          raw: true,
        });

        const totalPaid = paymentData[0]?.totalPaid || 0;
        const pendingAmount = userSubscription.Price - totalPaid; // Calculate pending amount

        if (pendingAmount <= 0) {
          return null; // Exclude fully paid subscriptions
        }

        // Fetch subscription plan details
        const subscriptionPlan = await SubscriptionPlan.findOne({
          where: { Id: userSubscription.SubscriptionPlanId },
          raw: true,
        });

        if (!subscriptionPlan) return null; // Ensure valid subscription plan

        return {
          ...subscriptionPlan,
          Id: userSubscription.Id,
        };
      })
    );

    // Filter out null values (i.e., subscriptions without pending payments)
    const validSubscriptionPlans = subscriptionPlans.filter(Boolean);

    if (validSubscriptionPlans.length === 0) {
      return res
        .status(404)
        .json({ message: "No active plans with pending payments found." });
    }

    return res.status(200).json(validSubscriptionPlans);
  } catch (error) {
    console.error("Error fetching subscription plan details:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
};
