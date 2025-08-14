const teacherModel = require('../models/button2');

module.exports = async function showButton2Page(req, res) {
  try {
    // get sorted rankings
    const rankings = await teacherModel.getTeacherRankings();

    // fetch details for each teacher and build a map { code: details }
    const detailsMap = {};
    for (const t of rankings) {
      detailsMap[t.code] = await teacherModel.getTeacherDetails(t.code);
    }

    // render view with both rankings and detailsMap
    return res.render('button2', { rankings, detailsMap, user: req.session.user || null });
  } catch (err) {
    console.error('button2 controller error:', err);
    return res.status(500).render('button2', { rankings: [], detailsMap: {}, error: 'Unable to load data' });
  }
};
