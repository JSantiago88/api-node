require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'The Username is required'
        });
    } else {
        res.json({
            data: body,
            ok: true
        });
    }

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json(`put usuario id: ${id}`);
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening in process.env.PORT: ${process.env.PORT}`);
})
