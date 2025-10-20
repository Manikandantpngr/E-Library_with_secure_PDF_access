const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
const pdfDir = path.join(uploadDir, 'pdfs');
const imgDir = path.join(uploadDir, 'images');
for (const d of [uploadDir, pdfDir, imgDir]) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (/pdf$/.test(file.mimetype)) cb(null, pdfDir);
    else cb(null, imgDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf';
  const isImage = file.mimetype.startsWith('image/');
  if (isPdf || isImage) cb(null, true);
  else cb(new Error('Only PDFs and images allowed'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
