const express = require('express'); 
const path = require('path'); //Building paths for activation
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); //A library that knows how to parser the body
const connectDB = require('./db');
const session = require('express-session'); //express library that knows how to create a session with the user
const app = express();

// load environment file
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

// mongodb connection
connectDB();
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// set view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use('/public', express.static(path.resolve(__dirname, 'public')));

// Configure sessions
app.use(session({
  secret : '1234',
  resave : true,
  saveUninitialized : true
}));

// load routers
app.use('/', require('./router'));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});