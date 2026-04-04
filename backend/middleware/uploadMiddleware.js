const fs = require("fs");
const path = require("path");
const multer = require("multer");

const legalDocsDir = path.join(__dirname, "..", "uploads", "legal-docs");
const eventPostersDir = path.join(__dirname, "..", "uploads", "event-posters");

if (!fs.existsSync(legalDocsDir)) {
  fs.mkdirSync(legalDocsDir, { recursive: true });
}

if (!fs.existsSync(eventPostersDir)) {
  fs.mkdirSync(eventPostersDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, legalDocsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${randomSuffix}-${safeOriginal}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF, JPG and PNG files are allowed"));
};

const uploadLegalDocuments = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});

const eventPosterStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, eventPostersDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${randomSuffix}-${safeOriginal}`);
  },
});

const eventPosterFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only JPG, PNG and WEBP poster files are allowed"));
};

const uploadEventPoster = multer({
  storage: eventPosterStorage,
  fileFilter: eventPosterFilter,
  limits: {
    files: 9,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { uploadLegalDocuments, uploadEventPoster };
