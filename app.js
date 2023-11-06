const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const DBconnection = require('./utliz/DBconnection')

const AuthRoute = require('./routes/auth');
const BarRoute = require('./routes/bar');
const serveImage = require('./routes/serveImage');
const morgan = require('morgan');

dotenv.config();
app.use(morgan("tiny"));

const corsOptions = {
  origin: '*',
}

DBconnection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use('/auth', AuthRoute);
app.use('/api', BarRoute);
app.get('/image/:id', serveImage);

module.exports = app;