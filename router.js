const express = require('express');
const route = express.Router();

route.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

module.exports = route;