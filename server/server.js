const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    res.json({
        people: body
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json(`put usuario id: ${id}`);
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(port, () => {
    console.log(`Listening in port: ${port}`);
})
