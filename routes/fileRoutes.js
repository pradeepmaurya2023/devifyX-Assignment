const { Router } = require("express");
const userAuth = require("../middleware/userAuth");
const {
  uploadFile,
  getFilesByUser,
  getPublicFiles,
  downloadFileById,
  makeFilePublicById,
  makeFilePrivateById,
  deleteFileById,
} = require("../controllers/fileController");

const fileRouter = Router();

// Upload a file by logged in User
fileRouter.post("/upload", userAuth, uploadFile);

// List all the files uploaded by logged in User
fileRouter.get("/", userAuth, getFilesByUser);

// List all public files
fileRouter.get("/public", userAuth, getPublicFiles);

// Download a file by ID
fileRouter.get("/:id", userAuth, downloadFileById);

// Make a file Public by ID by the owner
fileRouter.put("/:id/public", userAuth, makeFilePublicById);

// Make a file Private by ID by the owner
fileRouter.put("/:id/private", userAuth, makeFilePrivateById);

// Delete a file by ID
fileRouter.delete("/:id", userAuth, deleteFileById);

module.exports = fileRouter;
