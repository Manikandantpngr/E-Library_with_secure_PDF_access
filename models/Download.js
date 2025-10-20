const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  ip: { type: String },
  userAgent: { type: String },
  downloadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Download', downloadSchema);
