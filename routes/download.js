const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const Download = require('../models/Download');

// GET /download/:id  - streams a watermarked PDF for the authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

  // resolve relative paths created by upload route
  const pdfAbsolute = path.resolve(book.pdfPath.startsWith(path.sep) ? book.pdfPath : path.join(__dirname, '..', book.pdfPath));
    if (!fs.existsSync(pdfAbsolute)) return res.status(404).json({ message: 'File not found' });

    const origBytes = fs.readFileSync(pdfAbsolute);
    const pdfDoc = await PDFDocument.load(origBytes);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const watermarkText = `${req.user.email} • ${new Date().toISOString()}`;

    for (const page of pages) {
      const { width, height } = page.getSize();
      // draw diagonal watermark across the page
      const fontSize = Math.max(24, Math.min(width / 10, 48));
      const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
      const x = (width - textWidth) / 2;
      const y = height / 2;
      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.6, 0.6, 0.6),
        rotate: degrees(-45),
        opacity: 0.25
      });
    }

    const modifiedPdf = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
    // record download stats asynchronously
    try {
      Download.create({ user: req.user._id, book: book._id, ip: req.ip, userAgent: req.get('User-Agent') });
    } catch (e) { console.warn('Failed to record download', e.message); }

    res.send(Buffer.from(modifiedPdf));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
