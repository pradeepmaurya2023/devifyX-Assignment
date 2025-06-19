const path = require("path");
const fs = require("fs/promises");
const upload = require("../middleware/upload");
const sendResponse = require("../utils/sendResponse");
const File = require("../models/File");

// Upload a file by logged in User
function uploadFile(req, res) {
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
      return sendResponse(res, 201, "File Uploaded Successfully", newFile);
    } catch (err) {
      return sendResponse(res, 500, "Databse Error", err.message);
    }
  });
}

// List all the files uploaded by logged in User
async function getFilesByUser(req, res) {
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
}

// List all public files
async function getPublicFiles(req, res) {
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
}

// Download a file by ID
async function downloadFileById(req, res) {
  const userId = req.id;
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    // checking in db if there is a file by entered id
    if (!file) {
      return sendResponse(res, 404, "File Not Found.");
    }

    // file will be downladed onl if logged in user is the owner or file is public
    let isUploader = file.uploader.toString() === userId;
    if (!isUploader && !file.isPublic) {
      return sendResponse(
        res,
        403,
        "You are not Authorised to download the file."
      );
    }

    // Build absoulte path for file
    const filePath = path.resolve(file.path);

    // checking if file still exist on server
    try {
      await fs.access(filePath);
    } catch {
      return sendResponse(res, 410, "File is no longer available on Server.");
    }

    // if file exist, send the download link of file
    return res.download(filePath, file.originalName);
  } catch (err) {
    return sendResponse(res, 500, `Server error :- ${err.message}`);
  }
}

// Make a file Public by ID by the owner
async function makeFilePublicById(req, res) {
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
        "You are not authorized to update this file"
      );
    }

    await File.findByIdAndUpdate(fileId, { isPublic: true });
    return sendResponse(res, 200, "File is now Public.");
  } catch (err) {
    return sendResponse(res, 500, "Db error : " + err.message);
  }
}

// Make a file Private by ID by the owner
async function makeFilePrivateById(req, res) {
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
        "You are not authorized to update this file"
      );
    }

    await File.findByIdAndUpdate(fileId, { isPublic: false });
    return sendResponse(res, 200, "File is now Private.");
  } catch (err) {
    return sendResponse(res, 500, "Db error : " + err.message);
  }
}

// Delete a file by ID
async function deleteFileById(req, res) {
  const userId = req.id;
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    //Check if file exists in DB
    if (!file) {
      return sendResponse(res, 404, "File Not Found.");
    }

    // Check ownership of the file
    const isUploader = file.uploader.toString() === userId;
    if (!isUploader) {
      return sendResponse(
        res,
        403,
        "You are not authorised to delete this file."
      );
    }

    // file absolute path
    const filePath = path.resolve(file.path);
    console.log(filePath);
    // check if file exists on disk
    try {
      // throws error if file doesn't exist
      await fs.access(filePath);

      // delete file from server
      await fs.unlink(filePath);
    } catch (fileError) {
      // file might already be deleted
      return sendResponse(res, 410, "File not found on server.");
    }

    // delete file metadata from DB
    await File.findByIdAndDelete(fileId);

    return sendResponse(res, 200, "File deleted successfully.");
  } catch (err) {
    return sendResponse(res, 500, `Server error :- ${err.message}`);
  }
}

module.exports = {
  uploadFile,
  getFilesByUser,
  getPublicFiles,
  downloadFileById,
  makeFilePublicById,
  makeFilePrivateById,
  deleteFileById,
};
