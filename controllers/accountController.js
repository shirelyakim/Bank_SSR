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
      balance: 0,
    });

    account
      .save(account)
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

exports.getId = (req, res) => {
  const id = req.params.id;
  accountModel
    .findById(id)
    .then((account) => {
      if (!account) {
        res.status(404).send({ message: 'Not found account with id ' + id });
      } else {
        res.send(account);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving account with id ' + id + ', Error:' + err.message});
    });
};

exports.get = (req, res) => {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    accountModel
      .find()
      .then((account) => {
        res.send(account);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error Occurred while retriving account information',
        });
      });
  } else {
    let parsedQuery = {};
    const userID = query.userID;
    if (userID) {
      parsedQuery['userID'] = userID;
    }
    console.log(`searching accounts: ${JSON.stringify(parsedQuery)}`);

    accountModel
      .find(parsedQuery)
      .then((account) => {
        if (!account) {
          res
            .status(404)
            .send({ message: 'Not found accounts with the following query' });
        } else {
          res.send(account);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'Error retrieving accounts with the following query' });
      });
  }
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty' });
  }

  const id = req.params.id;
  accountModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update account with ${id}. Maybe transaction not found!`,
        });
      } else {
          res.status(200).send({ message: 'upated'})
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error Update account information' });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  accountModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Delete account with id ${id}. Maybe id is wrong`,
        });
      } else {
          res.status(200).send({ message: 'deleted'})
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete account with id=' + id,
      });
    });
};