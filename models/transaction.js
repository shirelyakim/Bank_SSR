const mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
  sourceUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  destenationUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('transaction', transactionSchema);