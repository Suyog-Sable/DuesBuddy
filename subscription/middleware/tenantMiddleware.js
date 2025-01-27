const Tenant = require("../models/tenant");

const validateTenant = async (req, res, next) => {
  const tenantId = req.headers["tenantid"];
  console.log("tenant id", tenantId);
  if (!tenantId) {
    return res
      .status(400)
      .json({ message: "tenantId is required in headers." });
  }

  try {
    const tenant = await Tenant.findOne({ where: { Id: tenantId } });
    console.log("validated tenant", tenant);
    if (!tenant) {
      return res.status(404).json({ message: "Invalid tenantId." });
    }

    req.tenantId = tenantId; // Attach tenantId to the request for further use
    next();
  } catch (error) {
    console.error("Error validating tenant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = validateTenant;
