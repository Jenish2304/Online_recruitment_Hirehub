// const multer = require('multer');
// const path = require('path');

// // Storage config
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/resumes'); // Folder for resumes
//     },
//     filename(req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// // File filter (only PDFs or DOC/DOCX)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /pdf|doc|docx/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only PDF, DOC, DOCX files are allowed'));
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }
// });

// module.exports = upload;

const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/resumes'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter (only PDFs or DOC/DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
