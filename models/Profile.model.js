const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  book: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  readAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  preferences: [String],
  history: [historySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);