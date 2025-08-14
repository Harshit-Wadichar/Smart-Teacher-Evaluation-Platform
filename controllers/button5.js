const classTipsModel = require('../models/button5');

module.exports = async function submitClassTip(req, res) {
  try {
    const tip = (req.body.tip || '').toString().trim();
    const name = req.session?.user?.name || (req.body.userName || '').trim();

    if (!name) return res.redirect('/login');

    if (!tip) {
      return res.render('button5', {
        user: req.session.user,
        error: 'Tip is required.',
        success: null,
        tip: ''
      });
    }

    const lastSubmissionTime = await classTipsModel.getLastSubmissionTime(name);
    if (lastSubmissionTime) {
      const daysDiff = (Date.now() - lastSubmissionTime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 180) {
        return res.render('button5', {
          user: req.session.user,
          error: `You can only submit once every 180 days. Try again in ${Math.ceil(180 - daysDiff)} day(s).`,
          success: null,
          tip
        });
      }
    }

    await classTipsModel.insertTip({ tip, name });

    return res.render('button5', {
      user: req.session.user,
      error: null,
      success: 'Thank you — your tip has been submitted.',
      tip: ''
    });

  } catch (err) {
    console.error('Error submitting class tip:', err);
    return res.render('button5', {
      user: req.session.user,
      error: 'Submission failed. Please try again.',
      success: null,
      tip: req.body.tip || ''
    });
  }
};
