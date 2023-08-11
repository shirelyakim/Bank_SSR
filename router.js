const express = require('express');
const route = express.Router();

const accountController = require('./controllers/accountController');
const transactionController = require('./controllers/transactionController');
const userController = require('./controllers/userController');

route.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// Users 
route.post('/api/users', userController.create);
route.get('/api/users/:id', userController.getId);
route.get('/api/users', userController.get);
route.post('/api/users/:id', userController.update);
route.delete('/api/users/:id', userController.delete);

// Transactions (is '/api/users' right? )
route.post('/api/users', transactionController.create)

// Accounts (is '/api/users' right? )
route.post('/api/users', accountController.create)

module.exports = route;


