// const express = require('express');
// const bodyParser = require('body-parser');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJSDoc = require('swagger-jsdoc'); // Import swagger-jsdoc
// // const sequelize = require('./config/db');
// // const { masterSequelize } = require('../config/db');
// const{ masterSequelize} = require('./config/db') 

// // Import routes
// const userRoutes = require('./routes/userRoutes');
// const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes');

// const app = express();
// app.use(bodyParser.json());

// // Swagger JSDoc Configuration
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0', // OpenAPI version
//     info: {
//       title: 'User-Tenant API',
//       version: '1.0.0',
//       description: 'API Documentation for User and Subscription Plans',
//     },
//   },
//   apis: ['./routes/*.js'], // Path to your route files where Swagger JSDoc comments are written
// };

// const swaggerSpec = swaggerJSDoc(swaggerOptions);

// // Swagger UI setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Routes
// app.use('/users', userRoutes);
// app.use('/subscription-plans', subscriptionPlanRoutes);

// const PORT = 3001;

// masterSequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
//   });
// }).catch(err => {
//   console.error('Unable to connect to the database:', err);
// });

const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const userRoutes = require("./routes/userRoutes");
const subscriptionPlanRoutes=require("./routes/subscriptionPlanRoutes")
const userSubscriptionPlanMappingRoutes=require("./routes/UserSubscriptionPlanMappingRoutes")
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
app.use("/subscription-plans",subscriptionPlanRoutes)
app.use("/user-subscription-plan-mappings",userSubscriptionPlanMappingRoutes)
// Start server
const PORT = process.env.PORT || 3001;

sequelize
  // .authenticate()
  // .then(() => {
  //   console.log("Database connected.");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  //})
 // .catch((err) => console.error("Unable to connect to database:", err));
