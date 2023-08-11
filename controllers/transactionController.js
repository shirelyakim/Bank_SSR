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

exports.getId = (req, res) => {
  const id = req.params.id;
  transactionModel
    .findById(id)
    .then((transaction) => {
      if (!transaction) {
        res.status(404).send({ message: 'Not found transaction with id ' + id });
      } else {
        res.send(transaction);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving transaction with id ' + id + ', Error:' + err.message});
    });
};

exports.get = (req, res) => {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    transactionModel
      .find()
      .then((transaction) => {
        res.send(transaction);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error Occurred while retriving transaction information',
        });
      });
  } else {
    let parsedQuery = {};
    const sourceAccountID = query.sourceAccountID;
    if (sourceAccountID) {
      parsedQuery['sourceAccountID'] = sourceAccountID;
    }
    const destenationAccountID = query.destenationAccountID;
    if (destenationAccountID) {
      parsedQuery['destenationAccountID'] = destenationAccountID;
    }
    console.log(`searching transactions: ${JSON.stringify(parsedQuery)}`);

    transactionModel
      .find(parsedQuery)
      .then((transaction) => {
        if (!transaction) {
          res
            .status(404)
            .send({ message: 'Not found transactions with the following query' });
        } else {
          res.send(transaction);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'Error retrieving transactions with the following query' });
      });
  }
};
