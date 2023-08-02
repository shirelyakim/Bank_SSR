const accountModel = require('../models/account');

exports.create = (req, res) => {
    // validate request
    if (!req.body) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
  
    // new account
    const account = new accountModel({
      userID: req.body.userID,
      balance: req.body.balance,
    });

    account
      .save(account)
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
  
