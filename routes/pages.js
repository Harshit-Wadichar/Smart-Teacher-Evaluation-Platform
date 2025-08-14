const express = require('express');
const router = express.Router();

const button1 = require('../controllers/button1'); 
const button2 = require('../controllers/button2'); 
const button3 = require('../controllers/button3'); 
const button4 = require('../controllers/button4'); 
const button5 = require('../controllers/button5'); 
const button6 = require('../controllers/button6'); 

function ensureGuest(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/home');
  next();
}
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

router.get('/', ensureGuest, (req, res) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.render('index');
});
router.get('/register', ensureGuest, (req, res) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.render('register');
});
router.get('/login', ensureGuest, (req, res) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.render('login');
});

router.get('/home', ensureAuth, (req, res) => res.render('home'));
router.get('/help', ensureAuth, (req, res) => res.render('help'));
router.get('/submitted', ensureAuth, (req, res) => res.render('submitted'));
router.get('/question', ensureAuth, (req, res) => res.render('question'));

// Button 1
router.get('/button1', ensureAuth, (req, res) => {
  res.render('button1', {
    user: req.session.user || null,
    error: null,
    success: null
  });
});
router.post('/button1', ensureAuth, button1);

// show rankings + details on one page
router.get('/button2', ensureAuth, button2);

// Button 3
router.get('/button3', ensureAuth, (req, res) => {
  res.render('button3', {
    user: req.session.user || null,
    error: null,
    success: null,
    sd: '',
    ms: '',
    rs: '',
    mv: '',
    bd: ''
  });
});
router.post('/button3', ensureAuth, button3);

// Button 4
router.get('/button4', ensureAuth, (req, res) => {
  res.render('button4', {
    user: req.session.user || null,
    error: null,
    success: null,
    sd: '',
    ms: '',
    rs: '',
    mv: '',
    bd: ''
  });
});
router.post('/button4', ensureAuth, button4);

// Button 5
router.get('/button5', ensureAuth, (req, res) => {
  res.render('button5', {
    user: req.session.user || null,
    error: null,
    success: null,
    tip: ''
  });
});
router.post('/button5', ensureAuth, button5);

// Button 6
router.get('/button6', ensureAuth, (req, res) => {
  res.render('button6', {
    user: req.session.user || null,
    error: null,
    success: null,
    tip: ''
  });
});
router.post('/button6', ensureAuth, button6);

module.exports = router;
