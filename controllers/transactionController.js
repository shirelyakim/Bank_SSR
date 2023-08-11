const transactionModel = require('../models/transaction');

exports.create = (req, res) => {
    // validate request
    if (!req.body) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
  
    // new transaction
    const transaction = new transactionModel({
      sourceAccountID: req.body.sourceAccountID,
      destenationAccountID: req.body.destenationAccountID,
      amount: req.body.amount,
      date: Date.now(),
    });

    transaction
      .save(transaction)
      .then((data) => {
        res.status(200).send({message: "OK"});
        })
        .catch((err) => {
          res.status(500).send({
            message:
                err.message ||
                'Some error occurred while creating a create operation',
          });
        });
};
  