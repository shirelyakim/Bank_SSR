const transactionModel = require('../models/transaction'); // Pointer to the transactions collection in the DB
const axios = require("axios");

exports.create = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Content cannot be empty!' });
    }

    // Create new transaction- init function
    const transaction = new transactionModel({
      sourceUserID: req.body.sourceUserID,
      destenationUserID: req.body.destenationUserID,
      amount: req.body.amount,
      date: Date.now(),
    });
    let srcBalance
    let dstBalance 
    try {
    //information about the sorce user:
      const src = await axios.get(`http://localhost:5000/api/users/${transaction.sourceUserID}`);
      srcBalance = src.data.balance;

      // Update source account balance
    } catch (error) {
      return res.status(404).send("Couldn't find source user");
    }

    try {
      //information about the destination user:
      const dst = await axios.get(`http://localhost:5000/api/users/${transaction.destenationUserID}`);
      dstBalance = dst.data.balance;

      // Update destination account balance
    } catch (error) {
      return res.status(404).send("Couldn't find destination user");
    }
    // Save the transaction
    await transaction.save();



    // Update Balance- Post request
    try{
    await axios.post(`http://localhost:5000/api/users/${transaction.sourceUserID}`, { balance: srcBalance - transaction.amount });  // the request body
    }catch (error) {
      console.log(error)
      return res.status(404).send("Couldn't update src users balance");
    }
    try{
      await axios.post(`http://localhost:5000/api/users/${transaction.destenationUserID}`, { balance: dstBalance + transaction.amount }); // the request body
    }catch (error) {
      console.log(error)
      return res.status(404).send("Couldn't update dst users balance");
    }

    res.status(200).send({ message: 'OK' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating a transaction',
    });
  }
};


// Displaying a transaction according to its ID
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

//Displaying the entire transaction or according to a specific filter
exports.get = async (req, res) => { 
  try {
    const query = req.query;  //Retrieving the query data (after the question mark)
    let transactions;

    if (Object.keys(query).length === 0) { // user wants to retrieve all transactions.
      transactions = await transactionModel.find();
    } else {
      const parsedQuery = {};  //empty json 
      if (query.sourceUserID) {   //If there is filtering by sourceUserID
        parsedQuery['sourceUserID'] = query.sourceUserID;  //add the key and its value
      }
      if (query.destenationUserID) { //If there is filtering by destenationUserID
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
