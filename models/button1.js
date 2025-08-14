const { promisePool } = require('./db');

async function getLastSubmission(userName) {
  const tables = ['ms', 'sz', 'rs', 'mv', 'bd'];
  let latest = null;
  
  for (const table of tables) {
    try {
      const [rows] = await promisePool.query(
        `SELECT submission_time FROM ${table} 
         WHERE userName = ? 
         ORDER BY submission_time DESC 
         LIMIT 1`,
        [userName]
      );
      if (rows[0] && (!latest || rows[0].submission_time > latest.submission_time)) {
        latest = rows[0];
      }
    } catch (err) {
      console.error(`Error checking ${table} table:`, err);
    }
  }
  return latest;
}

async function insertEvaluations(userName, msValues, szValues, rsValues, mvValues, bdValues) {
  const lists = [msValues, szValues, rsValues, mvValues, bdValues];
  if (!lists.every(a => Array.isArray(a) && a.length === 10)) {
    throw new Error('Each category array must contain exactly 10 values.');
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const insertSQL = table => `
      INSERT INTO ${table} (
        userName, 
        preparation_for_lecture, 
        capacity_to_clarify_doubt, 
        communication_skills, 
        motivating_students, 
        giving_practical_examples, 
        maintenance_of_discipline, 
        regularity_and_punctuality, 
        availability_of_teacher, 
        solving_exam_problems, 
        completion_of_syllabus,
        submission_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    await connection.query(insertSQL('ms'), [userName, ...msValues]);
    await connection.query(insertSQL('sz'), [userName, ...szValues]);
    await connection.query(insertSQL('rs'), [userName, ...rsValues]);
    await connection.query(insertSQL('mv'), [userName, ...mvValues]);
    await connection.query(insertSQL('bd'), [userName, ...bdValues]);

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error("TRANSACTION ERROR:", err);
    throw new Error('Database insertion failed');
  } finally {
    connection.release();
  }
}

module.exports = { getLastSubmission, insertEvaluations };