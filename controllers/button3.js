const improvementModel = require('../models/button3');

module.exports = async function submitTeacherTip(req, res) {
  try {
    const { sd, ms, rs, mv, bd } = req.body;
    const userName = req.session?.user?.name || (req.body.userName || '').trim();


    if (!userName) {
      // not logged in -> redirect to login
      return res.redirect('/login');
    }

    // Basic server-side validation: at least one tip present
    if (![sd, ms, rs, mv, bd].some(v => v && v.toString().trim() !== '')) {
      const errMsg = 'Please provide at least one tip.';
      console.log('validation failed:', errMsg);
      return res.render('button3', {
        user: req.session.user,
        error: errMsg,
        success: null,
        sd: sd || '',
        ms: ms || '',
        rs: rs || '',
        mv: mv || '',
        bd: bd || ''
      });
    }

    // Check 180-day rule (if your model/table supports user name)
    const lastSubmissionTime = await improvementModel.getLastSubmissionTime(userName);
    if (lastSubmissionTime) {
      const daysDiff = (new Date() - lastSubmissionTime) / (1000 * 60 * 60 * 24);
      if (daysDiff < 180) {
        const msg = `You can only submit data once every 180 days. Please try again later. (${Math.ceil(180 - daysDiff)} day(s) left)`;
        console.log('180-day block:', msg);
        return res.render('button3', {
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

    // Insert into DB
    await improvementModel.insertTeacherTip({ sd, ms, rs, mv, bd, userName });

    // Success — render same page with success message (so user sees it)
    const successMessage = 'Thank you! Your helpful tip has been submitted successfully.';
    console.log('insert success for', userName);
    return res.render('button3', {
      user: req.session.user,
      error: null,
      success: successMessage,
      sd: '',
      ms: '',
      rs: '',
      mv: '',
      bd: ''
    });

  } catch (err) {
    console.error('Error submitting teacher tip:', err);
    // show friendly error on the same page
    return res.render('button3', {
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
