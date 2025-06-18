const multer = require("multer");

// Configuring Storage
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    // Location on server where files will get stored
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // Uniquename for every file getting saved on the server
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

// adding filter for specific file types ( images and pdf only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JPEG, PNG, and PDF files are allowed"), false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //setting file size limit
});

module.exports = upload;
