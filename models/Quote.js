const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  Quote: { type: String, required: true },
  Author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  proposedBy: { type: string, required: false },
});

module.exports = mongoose.model('quote', quoteSchema);

//A verifier le type de usersDisliked et usersLiked