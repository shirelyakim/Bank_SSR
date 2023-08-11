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

// Transactions (is '/api/transactions' right? )
route.post('/api/transactions', transactionController.create)
route.get('/api/transactions/:id', transactionController.getId);
route.get('/api/transactions', transactionController.get);

// Accounts (is '/api/accounts' right? )
route.post('/api/accounts', accountController.create)
route.get('/api/accounts/:id', accountController.getId);
route.get('/api/accounts', accountController.get);
route.post('/api/accounts/:id', accountController.update);
route.delete('/api/accounts/:id', accountController.delete);

module.exports = route;
