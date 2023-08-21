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

// Transactions 
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
        let transactions = [];
        let user = (await axios.get(`http://localhost:5000/api/users/${req.session.user_id}`)).data
        let outTransactions;
        let inTransactions;
        try{ outTransactions = (await axios.get(`http://localhost:5000/api/transactions?sourceUserID=${req.session.user_id}`)).data
        } catch {outTransactions = [];}
        try{ inTransactions = (await axios.get(`http://localhost:5000/api/transactions?destenationUserID=${req.session.user_id}`)).data
        } catch {inTransactions = [];}
        var users = {};
        let rawUsers = (await axios.get(`http://localhost:5000/api/users`)).data
        for (let i = 0; i < rawUsers.length; i++) {
            users[rawUsers[i]._id] = rawUsers[i];
        }
        for (let i = 0; i < outTransactions.length; i++) {
            transactions.push({"id": outTransactions[i]._id,"date": new Date(outTransactions[i].date), "amount": `-${outTransactions[i].amount}`, "username": users[`${outTransactions[i].destenationUserID}`].userName});
        }
        for (let i = 0; i < inTransactions.length; i++) {
            transactions.push({"id": inTransactions[i]._id,"date": new Date(inTransactions[i].date), "amount": `+${inTransactions[i].amount}`, "username": users[`${inTransactions[i].sourceUserID}`].userName});
        }
        transactions = transactions.sort(function(a,b){return b.date - a.date;});
        res.render("home",{"session": req.session, "user": user, "transactions": transactions});
    }
    else{
        res.redirect("/login");
    }
});

//###Admin#####
route.get('/admin/users', async (req, res) => {
    if (req.session.user_id){
        if (req.session.admin) {
        let users = (await axios.get("http://localhost:5000/api/users")).data;
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id === req.session.user_id){
                users.splice(i,1);
            }
        }
        res.render("users",{"session": req.session, "users": users});
        }else{
            res.redirect("/");
        }
    }
    else{
        res.redirect("/login");
    }
});

route.get('/admin/statistics', async (req, res) => {
    if (req.session.user_id){
        if (req.session.admin) {
            res.render("statistics",{"session": req.session});
        }else{
            res.redirect("/");
        }
    }
    else{
        res.redirect("/login");
    }
});

route.get('/admin/transactions', async (req, res) => {
    if (!req.session.user_id) {
    return res.redirect('/login'); // Redirect to login if user not authenticated
    }
    if (!req.session.admin) {
    return res.redirect('/'); // Redirect to homepage if user is not an admin
    }

    const users = {};
    let specificUser
    const rawUsers = await axios.get('http://localhost:5000/api/users');
    for (const user of rawUsers.data) {
    users[user._id] = user;
    }

    let transactions = [];
    const query = req.query;

    if (query.userId) {
    specificUser = users[`${req.session.user_id}`].userName
    let outTransactions ;
    let inTransactions;
    try {outTransactions = await axios.get(`http://localhost:5000/api/transactions?sourceUserID=${query.userId}`);
        outTransactions = outTransactions.data
    }catch{outTransactions = [];}
    
    try{inTransactions = await axios.get(`http://localhost:5000/api/transactions?destenationUserID=${query.userId}`);
        inTransactions = inTransactions.data
    }catch{inTransactions = [];}
    for (const transaction of outTransactions) {
    transactions.push({
        "id": transaction._id,
        "date": new Date(transaction.date),
        "amount": transaction.amount,
        "tousername": users[`${transaction.destenationUserID}`].userName,
        "fromusername": users[`${transaction.sourceUserID}`].userName
    });
    }

    for (const transaction of inTransactions) {
    transactions.push({
        "id": transaction._id,
        "date": new Date(transaction.date),
        "amount": transaction.amount,
        "tousername": users[`${transaction.destenationUserID}`].userName,
        "fromusername": users[`${transaction.sourceUserID}`].userName
    }); 
    }
    } else {
    const rawTransactions = await axios.get('http://localhost:5000/api/transactions');
    for (const transaction of rawTransactions.data) {
        transactions.push({
        "id": transaction._id,
        "date": new Date(transaction.date),
        "amount": transaction.amount,
        "tousername": users[`${transaction.destenationUserID}`].userName,
        "fromusername": users[`${transaction.sourceUserID}`].userName
        });
    }
    }

    transactions.sort((a, b) => b.date - a.date);
    res.render('transactions', { "session": req.session, "transactions": transactions, "specificUser": specificUser });
  });

module.exports = route;