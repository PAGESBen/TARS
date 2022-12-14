const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  Quote: { type: String, required: true },
  Author: { type: String, required: true },
  imageUrl: { type: String, required: false },
  proposedBy: { type: String, required: false }
});

module.exports = mongoose.model('quote', quoteSchema);