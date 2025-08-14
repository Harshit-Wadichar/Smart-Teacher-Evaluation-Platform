const likesModel = require('../models/button4');

module.exports = async function submitTeacherLikes(req, res) {
  try {
    const { sd, ms, rs, mv, bd } = req.body;
    const userName = req.session?.user?.name || (req.body.userName || '').trim();

    if (!userName) return res.redirect('/login');

    // require at least one non-empty field
    if (![sd, ms, rs, mv, bd].some(v => v && v.toString().trim() !== '')) {
      const msg = 'Please provide at least one like/feedback.';
      return res.render('button4', {
        user: req.session.user,
        error: msg,
        success: null,
        sd: sd || '',
        ms: ms || '',
        rs: rs || '',
        mv: mv || '',
        bd: bd || ''
      });
    }

    // 180-day check
    const lastSubmissionTime = await likesModel.getLastSubmissionTime(userName);
    if (lastSubmissionTime) {
      const daysDiff = (Date.now() - lastSubmissionTime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 180) {
        const msg = `You can only submit once every 180 days. Please try again later.`;
        return res.render('button4', {
          user: req.session.user,
          error: msg,
          success: null,
          sd: sd || '',
          ms: ms || '',
          rs: rs || '',
          mv: mv || '',
          bd: bd || ''
        });
      }
    }

    // insert
    await likesModel.insertLikes({ sd, ms, rs, mv, bd, userName });

    // success — render same page with success message
    return res.render('button4', {
      user: req.session.user,
      error: null,
      success: 'Thank you — your feedback has been submitted.',
      sd: '',
      ms: '',
      rs: '',
      mv: '',
      bd: ''
    });

  } catch (err) {
    console.error('Error submitting teacher likes:', err);
    return res.render('button4', {
      user: req.session.user,
      error: 'Submission failed. Please try again.',
      success: null,
      sd: req.body.sd || '',
      ms: req.body.ms || '',
      rs: req.body.rs || '',
      mv: req.body.mv || '',
      bd: req.body.bd || ''
    });
  }
};
