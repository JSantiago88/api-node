const express = require('express');

const bcrypt = require('bcrypt');
const { generateAccessToken, verify } = require('../middlewares/auth');

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ mail: body.mail }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        let respUserInvalid = {
            ok: false,
            err: {
                message: 'Please verify your mail or password'
            }
        };

        if (!user) {
            return res.status(400).json(respUserInvalid);
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json(respUserInvalid);
        }

        const token = generateAccessToken(user);

        res.json({
            ok: true,
            data: user,
            token
        });

    });
});

app.post('/google', async (req, res) => {

    const token = req.body.idtoken;

     if (!token) {
         return res.status(400).json({
             err: {
                 message: 'Token is required'
             },
             ok: false
         });
     }

    let googleUser = await verify(token)
        .catch(err => {
            return err;
        });

    User.findOne({ mail: googleUser.mail }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {

            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Must use normal authentication'
                    }
                });
            }

            const token = generateAccessToken(userDB);

            res.json({
                ok: true,
                data: userDB,
                token
            });

        } else {
            let user = new User();

            user.name = googleUser.name;
            user.mail = googleUser.mail;
            user.img = googleUser.img;
            user.google = googleUser.google;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                const token = generateAccessToken(userDB);

                res.json({
                    ok: true,
                    data: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;
