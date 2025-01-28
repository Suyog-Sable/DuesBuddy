const fs = require('fs'); // Import fs module for file system operations
const path = require('path'); // Import path module for handling file paths
const User = require("../models/user");
const Tenant = require("../models/tenant");
const moment = require("moment");

const upload = require("../middleware/upload"); // Import your multer upload configuration

// Handle user folder and image uploads
const handleUserFolderAndImages = async (userId, files) => {
  try {
    const userFolder = path.join(__dirname, "..", "uploads", "users", userId.toString());

    // Create folder if it doesn't exist
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    if (files && files.length > 0) {
      for (let file of files) {
        const fileName = `${userId}_${file.originalname}`;
        const newFilePath = path.join(userFolder, fileName);

        // Move file to user folder
        fs.renameSync(file.path, newFilePath);

        // Update database with file paths
        if (file.fieldname === "profileImage") {
          await User.update({ ProfileImagePath: newFilePath }, { where: { Id: userId } });
        } else if (file.fieldname === "aadharImage") {
          await User.update({ AadharImagePath: newFilePath }, { where: { Id: userId } });
        }
      }
    }
  } catch (error) {
    console.error("Error handling user images:", error);
    throw new Error("Failed to process user images.");
  }
};

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

    const response = {
      Id: tenant.Id,
      email: tenant.email,
      Users: tenant.Users.map((user) => ({
        tenantId: user.tenantId,
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
      })),
    };

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

      console.log("Received tenantId:", tenantId);

      // Check if tenant exists
      const tenant = await Tenant.findOne({ where: { Id: tenantId } });
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found." });
      }

      // Validate and format DOB
      let formattedDOB;
      if (moment(DOB, "YYYY-MM-DD", true).isValid()) {
        formattedDOB = moment(DOB, "YYYY-MM-DD").toDate(); // Convert to JavaScript Date object
      } else {
        return res.status(400).json({
          message: "Invalid DOB format. Use 'YYYY-MM-DD'.",
        });
      }

      // Create user
      const user = await User.create({
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
        CreatedBy,
        PermanentAddress,
        PresentAddress,
      });

      // Handle file upload if files exist
      if (req.files) {
        const tempFolder = req.tempFolder;
        const files = req.files;
        await handleUserFolderAndImages(tempFolder, user.Id, files, req);
      }

      // Respond with success
      res.status(201).json({
        message: "User created successfully!",
        userDetails: {
          id: user.Id, // Return user id
          name: user.Name, // Return user name
          mobileNumber: user.MobileNo, // Return user mobile number
        },
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

// Update User by UserId and TenantId
exports.updateUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const updatedData = req.body;

    const user = await User.findOne({
      where: { TenantId: tenantId, Id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update(updatedData);

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

    res.status(200).json({ message: "User updated successfully", user: response });
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
