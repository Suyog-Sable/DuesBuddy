const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const userRoutes = require("./routes/userRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes");
const userSubscriptionPlanMappingRoutes = require("./routes/UserSubscriptionPlanMappingRoutes");
const paymentHistoryRoutes = require("./routes/PaymentHistoryRoutes");
const systemUserRoutes = require("./routes/SystemUserRoutes");
const attendanceRoutes = require("./routes/AttendanceRoutes");
const userDetailsRoutes = require("./routes/UserDetailsRoutes");
const sequelize = require("./config/db");

const app = express();
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Tenant API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/users", userRoutes);
app.use("/subscription-plans", subscriptionPlanRoutes);
app.use("/user-subscription-plan-mappings", userSubscriptionPlanMappingRoutes);
app.use("/payment-history", paymentHistoryRoutes);
app.use("/system-users", systemUserRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/", userDetailsRoutes);
// Start server
const PORT = process.env.PORT || 3001;

sequelize;
// .authenticate()
// .then(() => {
//   console.log("Database connected.");
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
//})
// .catch((err) => console.error("Unable to connect to database:", err));
