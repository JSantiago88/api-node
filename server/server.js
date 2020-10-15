require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(console.log("Base de datos ONLINE"))
    .catch(error => console.log(error));

app.listen(process.env.PORT, () => {
    console.log(`Listening in PORT: ${process.env.PORT}`);
})
