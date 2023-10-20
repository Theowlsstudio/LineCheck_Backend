const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const DBconnection = require('./utliz/DBconnection')
const port = process.env.PORT || 3002;

const Routes = require('./routes/index');
const serveImage = require('./routes/serveImage');
const corsOptions = {
  origin: '*',
}
dotenv.config();

DBconnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use('/api', Routes);
app.get('/image/:id', serveImage)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});