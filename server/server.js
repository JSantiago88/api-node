require('dotenv').config()
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// PUBLIC FOLDER
app.use(express.static(path.resolve(__dirname, '../public')));

// GLOBAL CONFIG ROUTES
app.use(require('./routes/index'));

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
