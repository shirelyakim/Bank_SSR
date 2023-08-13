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
        let account
        let transactions = []
        let user = (await axios.get(`http://localhost:5000/api/users/${req.session.user_id}`)).data
        let outTransactions
        let inTransactions
        try{ outTransactions = (await axios.get(`http://localhost:5000/api/transactions?sourceUserID=${req.session.user_id}`)).data
        } catch {outTransactions = []}
        try{ inTransactions = (await axios.get(`http://localhost:5000/api/transactions?destenationUserID=${req.session.user_id}`)).data
        } catch {inTransactions = []}
        var users = {};
        let rawUsers = (await axios.get(`http://localhost:5000/api/users`)).data
        for (let i = 0; i < rawUsers.length; i++) {
            users[rawUsers[i]._id] = rawUsers[i] 
        }
        for (let i = 0; i < outTransactions.length; i++) {
            transactions.push({"id": outTransactions[i]._id,"date": new Date(outTransactions[i].date), "amount": `-${outTransactions[i].amount}`, "username": users[`${outTransactions[i].destenationUserID}`].userName})
        }
        for (let i = 0; i < inTransactions.length; i++) {
            transactions.push({"id": inTransactions[i]._id,"date": new Date(inTransactions[i].date), "amount": `+${inTransactions[i].amount}`, "username": users[`${inTransactions[i].sourceUserID}`].userName})
        }
        transactions = transactions.sort(function(a,b){return b.date - a.date;});
        console.log(transactions)
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