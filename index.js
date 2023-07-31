const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./db');
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

// load routers
app.use('/', require('./router'));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});