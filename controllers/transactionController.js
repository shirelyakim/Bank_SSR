const transactionModel = require('../models/transaction');
const axios = require("axios");

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body) {
      res.status(400).send({ message: 'Content cannot be empty!' });
      return;
    }

    // Create new transaction
    const transaction = new transactionModel({
      sourceAccountID: req.body.sourceAccountID,
      destenationAccountID: req.body.destenationAccountID,
      amount: req.body.amount,
      date: Date.now(),
    });

    // Save the transaction
    await transaction.save();

    // Fetch source account
    const src = await axios.get(`http://localhost:5000/api/accounts/${transaction.sourceAccountID}`);
    const srcBalance = src.data.balance;

    // Update source account balance
    await axios.post(`http://localhost:5000/api/accounts/${transaction.sourceAccountID}`, { balance: srcBalance - transaction.amount });

    // Fetch destination account
    const dst = await axios.get(`http://localhost:5000/api/accounts/${transaction.destenationAccountID}`);
    const dstBalance = dst.data.balance;

    // Update destination account balance
    await axios.post(`http://localhost:5000/api/accounts/${transaction.destenationAccountID}`, { balance: dstBalance + transaction.amount });

    res.status(200).send({ message: 'OK' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating a transaction',
    });
  }
};

exports.getId = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await transactionModel.findById(id);

    if (!transaction) {
      return res.status(404).send({ message: `Not found transaction with id ${id}` });
    }

    res.send(transaction);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving transaction with id ${id}, Error: ${err.message}` });
  }
};

exports.get = async (req, res) => {
  try {
    const query = req.query;
    let transactions;

    if (Object.keys(query).length === 0) {
      transactions = await transactionModel.find();
    } else {
      const parsedQuery = {};
      if (query.sourceAccountID) {
        parsedQuery['sourceAccountID'] = query.sourceAccountID;
      }
      if (query.destenationAccountID) {
        parsedQuery['destenationAccountID'] = query.destenationAccountID;
      }
      console.log(`searching transactions: ${JSON.stringify(parsedQuery)}`);

      transactions = await transactionModel.find(parsedQuery);
    }

    if (transactions.length === 0) {
      return res.status(404).send({ message: 'No transactions found with the given query' });
    }

    res.send(transactions);
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving transactions: ' + err.message });
  }
};
