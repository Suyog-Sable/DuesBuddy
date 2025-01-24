// const Tenant = require("../models/tenant"); // Master Tenant table model
// const { getTenantConnection } = require("../config/database");
// const tenantMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
 
//     if (!authHeader) {
//       return res.status(400).json({ error: "Authorization header required" });
//     }
 
//     // const [scheme, credentials] = authHeader.split(" ");
//     // if (scheme !== "Basic" || !credentials) {
//     //   return res.status(400).json({ error: "Invalid authentication scheme" });
//     // }
 
//     // const decodedCredentials = Buffer.from(credentials, "base64").toString(
//     //   "utf-8"
//     // );
//     // const [username, password] = decodedCredentials.split(":");
 
//     // if (!username || !password) {
//     //   return res
//     //     .status(400)
//     //     .json({ error: "Username and password are required" });
//     // }
 
//     // Query the master database for tenant details
 
//     const Id = "1dc0";
//     const tenant = await Tenant.findOne({
//       where: { Id },
//     });
 
//     if (!tenant) {
//       return res.status(404).json({ error: "Tenant not found or inactive" });
//     }
//     console.log("Tenant", tenant);
//     // Attach tenantId to the request object
//     //req.tenantDb = tenant.Id;
//     const dbName = "tenant_1dc0";
//     const tenantSequelize = getTenantConnection(dbName); // dbName or equivalent
//     if (!tenantSequelize) {
//       return res
//         .status(500)
//         .json({ error: "Unable to connect to tenant database" });
//     }
//     req.tenantSequelize = tenantSequelize; // Attach Sequelize instance
//     console.log("tenant sequelize", req.tenantSequelize);
//     req.tenantId = tenant.Id; // Attach tenant ID
//     console.log(`Tenant found: ${tenant.Id}`);
//     next();
//   } catch (error) {
//     console.error("Error in tenant middleware:", error);
//     res.status(500).json({
//       error: "Failed to retrieve tenant data",
//     });
//   }
// };
 
// module.exports = tenantMiddleware;


const Tenant = require("../models/tenant");

const validateTenant = async (req, res, next) => {
  const tenantId = req.headers["tenantid"];
console.log("tenant id",tenantId)
  if (!tenantId) {
    return res.status(400).json({ message: "tenantId is required in headers." });
  }

  try {
    const tenant = await Tenant.findOne({ where: { Id: tenantId } });
    console.log("validated tenant",tenant)
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
