const userModel = require('../models/user');

exports.create = (req, res) => {
    // validate request
    if (!req.body) {
      res.status(400).send({ message: 'Content can not be empty!' });
      return;
    }
  
    // new user
    const user = new userModel({
      userName: req.body.userName,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      birthDate: req.body.birthDate, 
      joinDate: Date.now(),
    });

    user
      .save(user)
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
  userModelModel
    .findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Not found coin with id ' + id });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving coin with id ' + id + ', Error:' + err.message});
    });
};
