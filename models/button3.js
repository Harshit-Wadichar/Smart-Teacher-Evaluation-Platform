const { promisePool } = require('./db');

// Check last submission time for a user
const getLastSubmissionTime = async (userName) => {
  const [rows] = await promisePool.query(
    `SELECT submission_time 
     FROM improvement 
     WHERE name = ? 
     ORDER BY submission_time DESC 
     LIMIT 1`,
    [userName]
  );
  return rows.length ? new Date(rows[0].submission_time) : null;
};

// Insert a new teacher tip
const insertTeacherTip = async ({ sd, ms, rs, mv, bd, userName }) => {
  const [result] = await promisePool.query(
    `INSERT INTO improvement 
      (sd, ms, rs, mv, bd, name, submission_time) 
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [sd, ms, rs, mv, bd, userName]
  );
  return result;
};

module.exports = {
  getLastSubmissionTime,
  insertTeacherTip
};
