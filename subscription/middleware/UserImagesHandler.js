const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const renameAsync = promisify(fs.rename);
const { UpdateUserImages } = require("../controllers/userController");
require("dotenv").config(); //to access the .env file

async function handleUserFolderAndImages(tempFolder, userId, files, req) {
  const uploadsDir = path.normalize(process.env.UPLOADS_DIR + `/users`);
  const uploadsUrl = `${process.env.UPLOADS_URL}/users`.replace(/\\/g, "/");
  const userFolder = path.join(uploadsDir, String(userId));

  if (!fs.existsSync(userFolder)) {
    try {
      fs.mkdirSync(userFolder, { recursive: true });
    } catch (err) {
      console.error("Error creating user folder:", err);
      return res.status(500).json({ error: "Error creating user folder." });
    }
  }

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

  moveFiles(tempFolder, userFolder);
  fs.rmdirSync(tempFolder);

  const convertToUrl = (filePath) => {
    const normalizedFilePath = path.normalize(filePath);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    return normalizedFilePath
      .replace(normalizedUploadsDir, uploadsUrl)
      .replace(/\\/g, "/");
  };

  const profileImagePath = files?.ProfileImagePath
    ? convertToUrl(path.join(userFolder, files.ProfileImagePath[0].filename))
    : null;

  const aadharImagePath = files?.AadharImagePath
    ? convertToUrl(path.join(userFolder, files.AadharImagePath[0].filename))
    : null;

  // await UpdateUserImages(req, userId, profileImagePath, aadharImagePath);
  
  //update query
}

module.exports = { handleUserFolderAndImages };
