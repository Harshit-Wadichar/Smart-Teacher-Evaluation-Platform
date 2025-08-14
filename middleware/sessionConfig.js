const session = require('express-session');

module.exports = session({
    secret: process.env.SESSION_SECRET || 'greatestofalltime=harshit',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 3600000,
        sameSite: 'strict'
    }
});
