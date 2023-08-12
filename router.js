const express = require('express');
const route = express.Router();


//#######API#######
const transactionController = require('./controllers/transactionController');
const userController = require('./controllers/userController');
const { default: axios } = require('axios');

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
route.get('/api/userTransactions', transactionController.getUserTransaction);

//#######Home and Login#######
route.get('/login', (req, res) => {
    if (req.session.user_id){
        res.redirect("/")
    }
    else{
        res.render("login")
    }
});
route.post('/login', userController.login);
route.get('/logout', userController.logout);

route.get('/', async (req, res) => {
    if (req.session.user_id){
        let user = (await axios.get(`http://localhost:5000/api/users/${req.session.user_id}`)).data
        let transactions = (await axios.get(`http://localhost:5000/api/userTransactions`)).data

        transactions.sort(function(a,b){return new Date(b.date) - new Date(a.date);});
        res.render("home",{"session": req.session, "user": user, "transactions": transactions})
    }
    else{
        res.redirect("/login")
    }
});

//#######Views#######
route.get('/example', (req, res) => {
    if (req.session.user_id){
        res.render("example",{"session": req.session})
    }
    else{
        res.redirect("login")
    }
});

module.exports = route;
