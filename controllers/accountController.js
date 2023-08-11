const accountModel = require('../models/account');

exports.create = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Content can not be empty!' });
    }
  
    const account = new accountModel({
      userID: req.body.userID,
      balance: 0,
    });

    await account.save();
    res.status(200).send({ message: 'OK' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating an account',
    });
  }
};

exports.getId = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await accountModel.findById(id);
    
    if (!account) {
      res.status(404).send({ message: 'Not found account with id ' + id });
    } else {
      res.send(account);
    }
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving account with id ' + id + ', Error:' + err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const query = req.query;
    let accounts;

    if (Object.keys(query).length === 0) {
      accounts = await accountModel.find();
    } else {
      let parsedQuery = {};
      const userID = query.userID;

      if (userID) {
        parsedQuery['userID'] = userID;
      }

      console.log(`searching accounts: ${JSON.stringify(parsedQuery)}`);
      accounts = await accountModel.find(parsedQuery);
    }

    if (accounts.length === 0) {
      res.status(404).send({ message: 'No accounts found with the given query' });
    } else {
      res.send(accounts);
    }
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving account information: ' + err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Data to update can not be empty' });
    }

    const id = req.params.id;
    const data = await accountModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

    if (!data) {
      res.status(404).send({
        message: `Cannot Update account with ${id}. Maybe account not found!`,
      });
    } else {
      res.status(200).send({ message: 'Updated' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error updating account information: ' + err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await accountModel.findByIdAndDelete(id);

    if (!data) {
      res.status(404).send({
        message: `Cannot Delete account with id ${id}. Maybe id is wrong`,
      });
    } else {
      res.status(200).send({ message: 'Deleted' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Could not delete account with id=' + id });
  }
};
