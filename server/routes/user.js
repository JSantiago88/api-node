const express = require('express');
const User = require('../models/user');
const { authenticateToken, checkAdminRole } = require('../middlewares/auth');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/user', authenticateToken, (req, res) => {

    let from = req.query.from || 0;
    let limitUserForPage = req.query.limit || 5;

    let query = {
        state: true,
    };

    User.find(query, 'name google state mail role img')
        .skip(Number(from))
        .limit(Number(limitUserForPage))
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments(query, (err, amount) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    data: users,
                    amount
                });
            });

        });

});

app.post('/user', [authenticateToken, checkAdminRole], (req, res) => {

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

app.put('/user/:id', [authenticateToken, checkAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'mail', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        res.json(userDB);
    });
});

app.delete('/user/:id', [authenticateToken, checkAdminRole], (req, res) => {

    let id = req.params.id;

    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDeleted) {
            return res.json({
                ok: true,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        res.json({
            ok: true,
            data: userDeleted
        });
    });
});

module.exports = app;