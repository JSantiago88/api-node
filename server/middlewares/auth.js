const jwt = require('jsonwebtoken');
const roles = require('../config/roles');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =====================
// CHECK TOKEN
// =====================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({
        ok: false,
        err: {
            message: 'You must send the token'
        }
    });

    jwt.verify(token, process.env.SEED_AUTH, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not is valid'
                }
            });
        }

        req.user = decoded;

        next();
    });
};

// =====================
// CHECK ADMMIN ROLE
// =====================

const checkAdminRole = (req, res, next) => {

    let {user} = req.user;

    if (user.role === roles.admin) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Not authorized'
            }
        });
    }
};


// =====================
// CREATE ONE TOKEN
// =====================

const generateAccessToken = (user) => {
    return jwt.sign({
        user: user
    }, process.env.SEED_AUTH, { expiresIn: process.env.TOKEN_EXPIRATION });
}

// =====================
// CHECK GOOGLE TOKEN
// =====================

const verify = async (token) => { //TODO cambiar a archivo auth u otro con esa responsabilidad
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    return {
        name: payload.name,
        mail: payload.email,
        img: payload.picture,
        google: true
    }
}

module.exports = {
    authenticateToken,
    checkAdminRole,
    generateAccessToken,
    verify
}