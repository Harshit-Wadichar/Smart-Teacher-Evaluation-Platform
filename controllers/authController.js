const User = require('../models/user'); 
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.render('register', { message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.render('register', { message: 'Passwords do not match' });
    }

    const existing1 = await User.findByEmail(email);
    if (existing1.length > 0) {
      return res.render('register', { message: 'Email already registered' });
    }

    const existing2 = await User.findByName(name);
    if (existing2.length > 0) {
      return res.render('register', { message: 'User Name already exist' });
    }

    const result = await User.create(name, email, password);
    req.session.registered = true; // or loggedin, choose one flag consistently
    req.session.user = { id: result.insertId, name, email };
    return res.redirect('/home');

  } catch (err) {
    console.error('Register error:', err);
    // handle duplicate error more gracefully if needed
    return res.render('register', { message: 'Database error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.render('login', { message: 'All fields are required' });

    const results = await User.findByEmail(email);
    if (results.length === 0) {
      return res.render('login', { message: 'Email not registered' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('login', { message: 'Incorrect password' });
    }

    req.session.loggedin = true;
    req.session.user = { id: user.id, name: user.name, email: user.email };
    return res.redirect('/home');

  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { message: 'Database error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
