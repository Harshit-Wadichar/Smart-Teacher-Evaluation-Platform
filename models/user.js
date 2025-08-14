const { promisePool } = require('./db');
const bcrypt = require('bcryptjs');

const User = {
  // Returns array of users (either [] or [user])
  findByEmail: async (email) => {
    const [results] = await promisePool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return results;
  },

  //finds user by name and returns the data
  findByName: async (name) => {
    const [results] = await promisePool.query(
      'SELECT * FROM users WHERE name = ?',
      [name]
    );
    return results;
  },

  // Returns the result of INSERT (contains insertId)
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const [result] = await promisePool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result;
  }
};

module.exports = User;
