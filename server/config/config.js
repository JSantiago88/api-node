

// =====================
// Port
// =====================

process.env.PORT = process.env.PORT || 3000;

// =====================
// Environment
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// Database
// =====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL_CLUSTER;
}

process.env.URLDB = urlDB;

// =====================
// TOKEN EXPIRATION
// =====================

process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 7;

// =====================
// AUTH SEED
// =====================

process.env.SEED_AUTH = process.env.TOKEN_SECRET;