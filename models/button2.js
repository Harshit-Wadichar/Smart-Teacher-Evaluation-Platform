const { promisePool } = require('./db');

// Allowed teacher codes -> friendly names
const ALLOWED = {
  sz: 'Prof. Syed Zaki',
  ms: 'Prof. Mehnaz Sheikh',
  bd: 'Prof. Bulbul Das',
  mv: 'Prof. Mrunali Vaidya',
  rs: 'Prof. Rajni Singh'
};

async function averageForTable(table) {
  // compute average of the 10 columns then divide by 10
  const sql = `
    SELECT ROUND((
      IFNULL(AVG(preparation_for_lecture),0) +
      IFNULL(AVG(capacity_to_clarify_doubt),0) +
      IFNULL(AVG(communication_skills),0) +
      IFNULL(AVG(motivating_students),0) +
      IFNULL(AVG(giving_practical_examples),0) +
      IFNULL(AVG(maintenance_of_discipline),0) +
      IFNULL(AVG(regularity_and_punctuality),0) +
      IFNULL(AVG(availability_of_teacher),0) +
      IFNULL(AVG(solving_exam_problems),0) +
      IFNULL(AVG(completion_of_syllabus),0)
    )/10, 2) AS avg_score
    FROM \`${table}\`
  `;
  const [rows] = await promisePool.query(sql);
  return rows[0] ? parseFloat(rows[0].avg_score) || 0 : 0;
}

async function getTeacherRankings() {
  const results = [];
  for (const code of Object.keys(ALLOWED)) {
    const avg = await averageForTable(code);
    results.push({ code, name: ALLOWED[code], avg });
  }
  // sort descending
  results.sort((a, b) => b.avg - a.avg);
  return results;
}

async function getTeacherDetails(code) {
  code = (code || '').toLowerCase();
  if (!ALLOWED[code]) return null;
  const sql = `
    SELECT
      ROUND(AVG(IFNULL(preparation_for_lecture,0)),2) AS preparation,
      ROUND(AVG(IFNULL(capacity_to_clarify_doubt,0)),2) AS clarification,
      ROUND(AVG(IFNULL(communication_skills,0)),2) AS communication,
      ROUND(AVG(IFNULL(motivating_students,0)),2) AS motivation,
      ROUND(AVG(IFNULL(giving_practical_examples,0)),2) AS practical_examples,
      ROUND(AVG(IFNULL(maintenance_of_discipline,0)),2) AS discipline,
      ROUND(AVG(IFNULL(regularity_and_punctuality,0)),2) AS punctuality,
      ROUND(AVG(IFNULL(availability_of_teacher,0)),2) AS availability,
      ROUND(AVG(IFNULL(solving_exam_problems,0)),2) AS exam_problems,
      ROUND(AVG(IFNULL(completion_of_syllabus,0)),2) AS syllabus
    FROM \`${code}\`
  `;
  const [rows] = await promisePool.query(sql);
  return rows[0] || null;
}

module.exports = {
  getTeacherRankings,
  getTeacherDetails
};
