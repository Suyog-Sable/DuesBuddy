const Tenant = require("../models/tenant");
const SystemUser = require("../models/SystemUser");

// Fetch System Users by Tenant ID
exports.getSystemUsersByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findOne({
      where: { Id: tenantId },
      include: [
        {
          model: SystemUser,
          attributes: [
            "Id",
            "tenantId",
            "FullName",
            "MobileNumber",
            "UserName",
            "Role",
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
      Email: tenant.Email, // Assuming Tenant has an Email field
      SystemUsers: tenant.SystemUsers.map((user) => ({
        Id: user.Id,
        tenantId: user.tenantId,
        FullName: user.FullName,
        MobileNumber: user.MobileNumber,
        UserName: user.UserName,
        Role: user.Role,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching system users:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new System User
exports.createSystemUser = async (req, res) => {
  try {
    const { FullName, MobileNumber, UserName, Password, Role, tenantId } =
      req.body;

    if (!FullName || !UserName || !Password || !Role || !tenantId) {
      return res.status(400).json({
        message:
          "FullName, UserName, Password, Role, and tenantId are required.",
      });
    }

    const newUser = await SystemUser.create({
      FullName,
      MobileNumber,
      UserName,
      Password,
      Role,
      tenantId,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating system user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing System User
exports.updateSystemUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;
    const { FullName, MobileNumber, UserName, Password, Role } = req.body;

    const user = await SystemUser.findOne({
      where: { tenantId: tenantId, Id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "System user not found." });
    }

    user.FullName = FullName || user.FullName;
    user.MobileNumber = MobileNumber || user.MobileNumber;
    user.UserName = UserName || user.UserName;
    user.Password = Password || user.Password; // Ideally, hash passwords before saving
    user.Role = Role || user.Role;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating system user:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a System User
exports.deleteSystemUser = async (req, res) => {
  try {
    const { tenantId, userId } = req.params;

    const user = await SystemUser.findOne({
      where: { tenantId: tenantId, Id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "System user not found." });
    }

    await user.destroy();

    res.status(200).json({ message: "System user deleted successfully." });
  } catch (error) {
    console.error("Error deleting system user:", error);
    res.status(500).json({ error: error.message });
  }
};
