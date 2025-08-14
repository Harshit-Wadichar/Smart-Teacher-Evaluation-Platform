const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const sessionConfig = require('./middleware/sessionConfig');

dotenv.config();

const app = express();

// Middlewares
app.use(sessionConfig);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global vars
app.use((req, res, next) => {
    res.locals.loggedin = req.session.loggedin;
    res.locals.user = req.session.user;
    next();
});

// Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/authRoutes'));

app.listen(5000, () => console.log(`Server running on http://localhost:5000`));

