const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Borrow = require('../models/Borrow');
const Download = require('../models/Download');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'pdfs');

// GET /books - list all books
// GET /books - list + search/filter
router.get('/', async (req, res) => {
  const { q, author, category, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (author) filter.author = author;
  if (category) filter.category = category;
  if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') } ];
  const books = await Book.find(filter).skip((page-1)*limit).limit(Number(limit));
  res.json(books);
});

// GET /books/:id - get book metadata
// GET /books/:id - metadata
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id).select('-__v');
  if (!book) return res.status(404).json({ message: 'Not found' });
  res.json(book);
});

// POST /books - admin upload (delegates to upload route normally)
router.post('/', auth, role('admin'), async (req, res) => {
  const { title, author, category, pdfPath, coverImage } = req.body;
  if (!title || !pdfPath) return res.status(400).json({ message: 'title and pdfPath required' });
  const book = await Book.create({ title, author, category, pdfPath, coverImage });
  res.json(book);
});

// PUT /books/:id - admin
router.put('/:id', auth, role('admin'), async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// DELETE /books/:id - admin
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  // optionally remove file
  try { if (book && book.pdfPath) fs.unlinkSync(path.join(__dirname,'..', book.pdfPath)); } catch(e){}
  res.json({ message: 'Deleted' });
});

// POST /books/:id/borrow - borrow a book for X days
router.post('/:id/borrow', auth, async (req, res) => {
  const { days = 14 } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Not found' });
  const dueDate = new Date(Date.now() + (days*24*60*60*1000));
  const borrow = await Borrow.create({ user: req.user._id, book: book._id, dueDate });
  res.json(borrow);
});

// GET /books/:id/stats - aggregate downloads & borrows
router.get('/:id/stats', auth, role('admin'), async (req, res) => {
  const bookId = req.params.id;
  const downloads = await Download.countDocuments({ book: bookId });
  const borrows = await Borrow.countDocuments({ book: bookId });
  res.json({ downloads, borrows });
});

module.exports = router;
