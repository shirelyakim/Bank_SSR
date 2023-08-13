const transactionModel = require('../models/transaction');
const axios = require("axios");

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body) {
      return res.status(400).send({ message: 'Content cannot be empty!' });
    }

    // Create new transaction
    const transaction = new transactionModel({
      sourceUserID: req.body.sourceUserID,
      destenationUserID: req.body.destenationUserID,
      amount: req.body.amount,
      date: Date.now(),
    });
    let srcBalance
    let dstBalance 
    try {
      // Fetch source account
      const src = await axios.get(`http://localhost:5000/api/users/${transaction.sourceUserID}`);
      srcBalance = src.data.balance;

      // Update source account balance
    } catch (error) {
      return res.status(404).send("Couldn't find source user");
    }

    try {
      // Fetch destination account
      const dst = await axios.get(`http://localhost:5000/api/users/${transaction.destenationUserID}`);
      dstBalance = dst.data.balance;

      // Update destination account balance
    } catch (error) {
      return res.status(404).send("Couldn't find destination user");
    }
    // Save the transaction
    await transaction.save();
    try{
    await axios.post(`http://localhost:5000/api/users/${transaction.sourceUserID}`, { balance: srcBalance - transaction.amount });
    }catch (error) {
      console.log(error)
      return res.status(404).send("Couldn't update src users balance");
    }
    try{
      await axios.post(`http://localhost:5000/api/users/${transaction.destenationUserID}`, { balance: dstBalance + transaction.amount });
    }catch (error) {
      return res.status(404).send("Couldn't update dst users balance");
    }

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
      return res.status(404).send({ message: `Not found transaction with id` });
    }

    res.send(transaction);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving transaction with id ${req.params.id}, Error: ${err.message}` });
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
      if (query.sourceUserID) {
        parsedQuery['sourceUserID'] = query.sourceUserID;
      }
      if (query.destenationUserID) {
        parsedQuery['destenationUserID'] = query.destenationUserID;
      }
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
