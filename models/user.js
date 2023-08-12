const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);