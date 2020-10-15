const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const app = express();

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        mail: body.mail,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            data: userDB,
            ok: true
        });
    });


});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json(`put usuario id: ${id}`);
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

module.exports = app;