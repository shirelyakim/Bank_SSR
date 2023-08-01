const mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
  sourceAccountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true,
  },
  destenationAccountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
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