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
        res.status(200);
        })
        .catch((err) => {
          res.status(500).send({
            message:
                err.message ||
                'Some error occurred while creating a create operation',
          });
        });
};
  
exports.getId = (req, res) => {
  const id = req.params.id;
  transactionModel
    .findById(id)
    .then((transaction) => {
      if (!transaction) {
        res
          .status(404)
          .send({ message: 'Not found transaction with id ' + id });
      } else {
        res.send(transaction);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          'Error retrieving transaction with id ' + id + '\nError: ' + err,
      });
    });
};
