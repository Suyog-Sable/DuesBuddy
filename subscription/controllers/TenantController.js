const Tenant = require("../models/tenant");

// Create a new tenant
const createTenant = async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tenants
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tenant by ID
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tenant by ID
const updateTenant = async (req, res) => {
  try {
    const [updated] = await Tenant.update(req.body, {
      where: { Id: req.params.id },
    });
    if (updated) {
      const updatedTenant = await Tenant.findByPk(req.params.id);
      return res.status(200).json(updatedTenant);
    }
    res.status(404).json({ message: "Tenant not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tenant by ID
const deleteTenant = async (req, res) => {
  try {
    const deleted = await Tenant.destroy({ where: { Id: req.params.id } });
    if (deleted) {
      return res.status(204).send();
    }
    res.status(404).json({ message: "Tenant not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Validate Tenant
const validateTenantCredentials = async (req, res) => {
  try {
    const { EmailId, Password } = req.body;

    // Check if both EmailId and Password are provided
    if (!EmailId || !Password) {
      return res
        .status(400)
        .json({ message: "EmailId and Password are required" });
    }

    // Find the tenant with matching credentials
    const tenant = await Tenant.findOne({
      where: { EmailId, Password }, // NOTE: Consider hashing passwords in production!
    });

    if (!tenant) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the entire tenant object
    res.status(200).json(tenant);
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  validateTenantCredentials,
};
