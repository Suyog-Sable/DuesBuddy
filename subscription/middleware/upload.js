const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config(); // To access the .env file

// Utility function to format date for filenames
const formatDate = () => {
  const now = new Date();
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(/:/g, "-") // Replace invalid ':' with '-'
    .replace(/\s/g, "-") // Replace spaces with '-'
    .replace(/,/g, ""); // Remove the comma
};

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const databaseName = req.tenantDb?.config?.database; // Fetch tenant database name
    // if (!databaseName) {
    //   return cb(new Error("Database name not found in the request"), null);
    // }

    if (!req.tempFolder) {
      const uploadfolder = process.env.UPLOADS_DIR;
      const tempFolder = path.join(uploadfolder, uuidv4()); // Append a unique UUID

      fs.mkdirSync(tempFolder, { recursive: true }); // Ensure folders exist
      req.tempFolder = tempFolder; // Save the GUID folder to req object
      req.fileCounter = req.fileCounter || 0; // Initialize file counter for the request
    }

    cb(null, req.tempFolder); // Use the same GUID folder for all files in this request
  },

  filename: (req, file, cb) => {
    let fileName = "";
    const formattedDate = formatDate();
    const extension = path.extname(file.originalname); // Correct extension handling

    req.fileCounter += 1; // Increment for each file uploaded
    switch (file.fieldname) {
      case "ProfileImagePath":
        fileName = `profile-pic${extension}`;
        break;
      case "AadharImagePath":
        fileName = `aadhar-image${extension}`;
        break;
      case "imagePath":
        fileName = `payment-receipt-${formattedDate}${extension}`;
        break;

      default:
        fileName = `file-${Date.now()}${extension}`;
    }
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false); // Reject the file
  }
};

// Configure multer to handle multiple files
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 1MB
}).fields([
  { name: "ProfileImagePath" },
  { name: "AadharImagePath" },
  { name: "imagePath" },
]);

module.exports = upload;
