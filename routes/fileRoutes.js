const { Router } = require("express");
const userAuth = require("../middleware/userAuth");
const upload = require("../middleware/upload");
const sendResponse = require("../utils/sendResponse");
const File = require("../models/File");

const fileRouter = Router();

// Upload a file by logged in User
fileRouter.post("/upload", userAuth, (req, res) => {
  upload.single("file")(req, res, async function (err) {
    if (err) {
      return sendResponse(res, 400, "Upload Error: " + err.message);
    }

    // if No file uploaded
    if (!req.file) {
      return sendResponse(res, 400, "No file uploaded or invalid file type.");
    }

    try {
      let newFile = new File({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        fileType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        isPublic: false,
        uploader: req.id,
      });
      await newFile.save();
      // if everything goes right
      return sendResponse(res, 200, "File Uploaded Successfully", req.file);
    } catch (err) {
      return sendResponse(res, 500, "Databse Error", err.message);
    }
  });
});

// List all the files uploaded by logged in User
fileRouter.get("/", userAuth, async (req, res) => {
  let userId = req.id;

  try {
    // getting all the files uploaded by the logged in user
    let files = await File.find({ uploader: userId });

    if (files.length < 1) {
      return sendResponse(res, 404, "User have not uploaded any files yet.");
    }
    return sendResponse(res, 200, { ...files });
  } catch (err) {
    return sendResponse(res, 500, "Db error : " + err.message);
  }
});

// List all public files
fileRouter.get("/public", userAuth, async (req, res) => {
  try {
    // getting all the public files if any user is logged in
    let files = await File.find({ isPublic: true });

    if (files.length < 1) {
      return sendResponse(res, 404, "There are no public files yet.");
    }
    return sendResponse(res, 200, { ...files });
  } catch (err) {
    return sendResponse(res, 500, "Db error : " + err.message);
  }
});

// Download a file by ID
fileRouter.get("/:id", userAuth, (req, res) => {});

// Make a file Public by ID by the owner
fileRouter.put("/:id/public", userAuth, async (req, res) => {
  let userId = req.id;
  let fileId = req.params.id;
  try {
    // checking if file exist or not
    let file = await File.findById(fileId);

    // if file doesnt exist
    if (!file) {
      return sendResponse(res, 404, "Required file is not present.");
    }

    // if logged in user is not the owner of file, he wont be able to update the file
    if (file.uploader.toString() !== userId) {
      return sendResponse(
        res,
        403,
        "You are not authorized to update this course"
      );
    }

    await File.findByIdAndUpdate(fileId, { isPublic: true });
    return sendResponse(res, 200, "File is now Public.");
  } catch (err) {
    return sendResponse(res, 500, "Db error : " + err.message);
  }
});

// Delete a file by ID
fileRouter.delete("/:id", userAuth, (req, res) => {});

module.exports = fileRouter;
