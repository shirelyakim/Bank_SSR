const express = require('express');
const route = express.Router();

const accountController = require('./controllers/accountController');
const transactionController = require('./controllers/transactionController');
const userController = require('./controllers/userController');

route.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

module.exports = route;