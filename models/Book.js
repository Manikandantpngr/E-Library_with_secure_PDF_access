const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  pdfPath: { type: String, required: true },
  coverImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
