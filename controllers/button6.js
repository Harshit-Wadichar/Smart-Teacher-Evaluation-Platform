const collegeTipsModel = require('../models/button6');

module.exports = async function submitCollegeTip(req, res) {
  try {
    const tip = (req.body.tip || '').toString().trim();
    const name = req.session?.user?.name || (req.body.name || '').trim();

    if (!name) return res.redirect('/login');

    if (!tip) {
      return res.render('button6', {
        user: req.session.user,
        error: 'Tip is required.',
        success: null,
        tip: ''
      });
    }

    const lastSubmissionTime = await collegeTipsModel.getLastSubmissionTime(name);
    if (lastSubmissionTime) {
      const daysDiff = (Date.now() - lastSubmissionTime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 180) {
        return res.render('button6', {
          user: req.session.user,
          error: `You can only submit once every 180 days. Try again in ${Math.ceil(180 - daysDiff)} day(s).`,
          success: null,
          tip
        });
      }
    }

    await collegeTipsModel.insertTip({ tip, name });

    return res.render('button6', {
      user: req.session.user,
      error: null,
      success: 'Thank you — your tip has been submitted.',
      tip: ''
    });

  } catch (err) {
    console.error('Error submitting college tip:', err);
    return res.render('button6', {
      user: req.session.user,
      error: 'Submission failed. Please try again.',
      success: null,
      tip: req.body.tip || ''
    });
  }
};
