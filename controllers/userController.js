const userModel = require('../models/user'); // Pointer to the users collection in the DB
const axios = require('axios');

exports.create = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Content cannot be empty!' });
    }

    const user = new userModel({
      userName: req.body.userName,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      birthDate: new Date(req.body.birthDate),
      joinDate: Date.now(),
      balance: 0,
      disabled: false,
    });

    await user.save();
    res.status(200).send({ message: 'OK' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error occurred while creating a user',
    });
  }
};

exports.getId = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ message: `Not found user with ID` });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving user with id, Error: ${err.message}` });
  }
};

exports.get = async (req, res) => {
  try {
    const query = req.query;
    let users;

    if (Object.keys(query).length === 0) {
      users = await userModel.find();
    } else {
      const parsedQuery = {};
      if (query.userName) {    //If there is filtering by username
        parsedQuery['userName'] = query.userName;   //add the key and its value
      }
      if (query.isAdmin) {   //If there is filtering by IsAdmin
        parsedQuery['isAdmin'] = query.isAdmin; //add the key and its value
      }

      users = await userModel.find(parsedQuery);
    }

    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found with the given query' });
    }

    res.send(users);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving users: ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: 'Data to update cannot be empty' });
    }

    const id = req.params.id;
    const data = await userModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }); //Return Updated Json (Document)

    if (!data) { // if ID not exist 
      return res.status(404).send({ message: `Cannot update user with id` });
    }

    res.status(200).send({ message: 'Updated' });
  } catch (err) {
    res.status(500).send({ message: 'Error updating user information' });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userModel.findByIdAndUpdate(id, {"disabled": true}, { useFindAndModify: false }); //Return Updated Json (Document)
    if (!data) { // if ID not exist 
      return res.status(404).send({ message: `Cannot delete user with id` });
    }

    res.status(200).send({ message: 'Deleted' });
  } catch (err) {
    res.status(500).send({ message: `Could not delete user with id` });
  }
};

exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
    const user = (await axios.get(`http://localhost:5000/api/users?userName=${username}`)).data[0]  
    if (user.password === password && !user.disabled){
        req.session.user_id = user._id 
        req.session.admin = user.isAdmin 
        req.session.username = user.userName
        res.status(200).send("OK")
    }
    else{
        res.status(404).send("Wrong Username Or Password")
    }
  } catch (err) {
    res.status(500).send(`failed to login with: ${err}`);
  }
}

exports.logout = async (req, res) => {
  req.session.destroy()
  res.redirect("/")
}