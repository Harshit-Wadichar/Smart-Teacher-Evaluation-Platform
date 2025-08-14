const { promisePool } = require('./db'); 

// Get last submission time for a name
const getLastSubmissionTime = async (name) => {
  const [rows] = await promisePool.query(
    `SELECT submission_time 
     FROM class 
     WHERE name = ? 
     ORDER BY submission_time DESC 
     LIMIT 1`,
    [name]
  );
  return rows.length ? new Date(rows[0].submission_time) : null;
};

// Insert a new tip
const insertTip = async ({ tip, name }) => {
  const [result] = await promisePool.query(
    `INSERT INTO class (tip, name, submission_time) 
     VALUES (?, ?, NOW())`,
    [tip, name]
  );
  return result;
};

module.exports = {
  getLastSubmissionTime,
  insertTip
};
