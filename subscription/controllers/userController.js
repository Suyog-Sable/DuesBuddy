const User = require("../models/user");
const Tenant = require("../models/tenant");

const upload = require("../middleware/upload"); // Import your multer upload configuration
const { handleUserFolderAndImages } = require("../controllers/userController"); // Import your handleUserFolderAndImages function

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
// Create User
// exports.createUser = async (req, res) => {
//   try {
//     const {
//       tenantId,
//       Name,
//       Wing,
//       RoomNo,
//       MobileNo,
//       EmailId,
//       Gender,
//       DOB,
//       IsTrainer,
//       Location,
//       CreatedBy,
//       PermanentAddress,
//       PresentAddress,
//       AadharImagePath,
//       ProfileImagePath,
//     } = req.body;

//     console.log("Looking for tenantId:", tenantId);

//     const tenant = await Tenant.findOne({
//       where: { Id: tenantId },
//     });

//     if (!tenant) {
//       console.log("Tenant not found with Id:", tenantId);
//       return res.status(404).json({ message: "Tenant not found." });
//     }

//     // Validate DOB
//     const parsedDOB = new Date(DOB);
//     if (!parsedDOB) {
//       return res
//         .status(400)
//         .json({ message: "Invalid DOB format. Use 'YYYY-MM-DD'." });
//     }
//     const formattedDOB = parsedDOB.toISOString().slice(0, 19).replace("T", " ");

//     // Create a new user associated with the tenant
//     const user = await User.create({
//       tenantId,
//       Name,
//       Wing,
//       RoomNo,
//       MobileNo,
//       EmailId,
//       Gender,
//       DOB: new Date().toISOString().slice(0, 19).replace("T", " "),
//       IsTrainer,
//       Location,
//       CreatedBy,
//       PermanentAddress,
//       PresentAddress,
//       AadharImagePath,
//       ProfileImagePath,
//     });

//     res.status(201).json({ message: "User created successfully!", user });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res
          .status(400)
          .json({ message: "File upload failed.", error: err.message });
      }

      const {
        tenantId,
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

      const tenant = await Tenant.findOne({ where: { Id: tenantId } });

      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found." });
      }

      const parsedDOB = new Date(DOB);
      if (!parsedDOB || isNaN(parsedDOB)) {
        return res
          .status(400)
          .json({ message: "Invalid DOB format. Use 'YYYY-MM-DD'." });
      }
      const formattedDOB = parsedDOB
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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

      if (req.files) {
        const tempFolder = req.tempFolder;
        const files = req.files;

        await handleUserFolderAndImages(tempFolder, user.Id, files, req);
      }

      res.status(201).json({ message: "User created successfully!", user });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update User by UserId and TenantId
exports.updateUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const updatedData = req.body;

    const user = await User.findOne({
      where: { TenantId: tenantId, UserId: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update(updatedData);

    const response = {
      Id: user.UserId,
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

    res
      .status(200)
      .json({ message: "User updated successfully", user: response });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

// update user images
exports.UpdateUserImages = async (
  req,
  userId,
  profileImagePath,
  aadharImagePath
) => {
  try {
    const User = require("../models/user");

    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    await user.update({
      ProfileImagePath: profileImagePath || null,
      AadharImagePath: aadharImagePath || null,
    });

    console.log("Images updated successfully");
  } catch (error) {
    console.error("Failed to update images:", error);
    throw new Error(`Failed to update images: ${error.message}`);
  }
};

// Delete User by UserId and TenantId
exports.deleteUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;

    const user = await User.findOne({
      where: { TenantId: tenantId, UserId: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};
