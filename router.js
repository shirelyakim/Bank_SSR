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
//###Admin#####
route.get('/admin', async (req, res) => {
    if (req.session.user_id){
        let users = (await axios.get("http://localhost:5000/api/users")).data
        res.render("admin",{"session": req.session, "users": users})
    }
    else{
        res.redirect("login")
    }
});


route.get('/admin/transactions', async (req, res) => {
    if (!req.session.user_id) {
    return res.redirect('/login'); // Redirect to login if user not authenticated
    }
    if (!req.session.admin) {
        return res.redirect('/'); // Redirect to login if user not authenticated
    }
    const users = {};
    let rawUsers = (await axios.get('http://localhost:5000/api/users')).data;
    for (let i = 0; i < rawUsers.length; i++) {
    users[rawUsers[i]._id] = rawUsers[i];
    }

    let transactions = [];
    const query = req.query;

    if (query.userId) {
        console.log("test")
    const outTransactions = await axios.get(`http://localhost:5000/api/transactions?sourceUserID=${query.userId}`);
    const inTransactions = await axios.get(`http://localhost:5000/api/transactions?destinationUserID=${query.userId}`);

    for (let i = 0; i < outTransactions.data.length; i++) {
        transactions.push({
        "id": outTransactions.data[i]._id,
        "date": new Date(outTransactions.data[i].date),
        "amount": outTransactions.data[i].amount,
        "tousername": users[outTransactions.data[i].destenationUserID].userName,
        "fromusername": users[outTransactions.data[i].sourceUserID].userName
        });
    }

    for (let i = 0; i < inTransactions.data.length; i++) {
        transactions.push({
        "id": inTransactions.data[i]._id,
        "date": new Date(inTransactions.data[i].date),
        "amount": inTransactions.data[i].amount,
        "tousername": users[inTransactions.data[i].destenationUserID].userName,
        "fromusername": users[inTransactions.data[i].sourceUserID].userName
        });
    }
    } else {
    const rawTransactions = await axios.get('http://localhost:5000/api/transactions');
    for (let i = 0; i < rawTransactions.data.length; i++) {
        transactions.push({
        "id": rawTransactions.data[i]._id,
        "date": new Date(rawTransactions.data[i].date),
        "amount": rawTransactions.data[i].amount,
        "tousername": users[rawTransactions.data[i].destenationUserID].userName,
        "fromusername": users[rawTransactions.data[i].sourceUserID].userName
        });
    }
    }
    transactions = transactions.sort(function(a,b){return b.date - a.date;});
    res.render('transactions', { "session": req.session, "transactions": transactions });
  });

module.exports = route;