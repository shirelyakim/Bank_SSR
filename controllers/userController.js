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
      birthDate: new Date(req.body.birthDate), 
      joinDate: Date.now(),
    });
    console.log(user)

    user
      .save(user)
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
    userModel
      .findById(id)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Not found user with id ' + id });
        } else {
          res.send(user);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error retrieving user with id ' + id + ', Error:' + err.message});
      });
};

exports.get = (req, res) => {
    const query = req.query;
    if (Object.keys(query).length === 0) {
      userModel
        .find()
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Error Occurred while retriving user information',
          });
        });
    } else {
      let parsedQuery = {};
      const userName = query.userName;
      if (userName) {
        parsedQuery['userName'] = userName;
      }
      const isAdmin = query.isAdmin;
      if (isAdmin) {
        parsedQuery['isAdmin'] = isAdmin;
      }
      console.log(`searching users: ${JSON.stringify(parsedQuery)}`);
  
      userModel
        .find(parsedQuery)
        .then((user) => {
          if (!user) {
            res
              .status(404)
              .send({ message: 'Not found users with the following query' });
          } else {
            res.send(user);
          }
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: 'Error retrieving users with the following query' });
        });
    }
};

exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({ message: 'Data to update can not be empty' });
    }
  
    const id = req.params.id;
    userModel
      .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update user with ${id}. Maybe transaction not found!`,
          });
        } else {
            res.status(200).send({ message: 'upated'})
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error Update user information' });
      });
};

exports.delete = (req, res) => {
    const id = req.params.id;
  
    userModel
      .findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Delete user with id ${id}. Maybe id is wrong`,
          });
        } else {
            res.status(200).send({ message: 'deleted'})
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete user with id=' + id,
        });
      });
};