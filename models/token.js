const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, index: true, unique: true }
});


module.exports = mongoose.model("tokens", tokenSchema);