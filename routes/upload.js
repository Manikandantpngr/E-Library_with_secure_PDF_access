const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');

const uploadDir = path.join(__dirname, '..', 'uploads', 'pdfs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// accept only PDFs and limit to 25MB
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

const sharedUpload = require('../middleware/upload');

// POST /upload/book - multipart/form-data { title, author, category, pdf }
router.post('/book', upload.single('pdf'), async (req, res) => {
  try {
    const { title, author, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'PDF is required' });
    // store relative path so project can be moved
    const pdfPath = path.join('uploads', 'pdfs', req.file.filename);
    const book = await Book.create({ title, author, category, pdfPath });
    res.json({ book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /upload/image - multipart/form-data { image }
// uses shared middleware that accepts images and PDFs and stores into uploads/images
router.post('/image', sharedUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const imgPath = path.join('uploads', 'images', req.file.filename);
    // return relative path for client to include in book metadata
    return res.json({ path: imgPath, filename: req.file.filename });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
