const evaluationModel = require("../models/button1");

function collectCategory(prefix, body) {
  const arr = [];
  for (let i = 1; i <= 10; i++) {
    const key = `${prefix}${i}`;
    const raw = body[key];
    if (raw === undefined || raw === null || raw === "") arr.push(0);
    else {
      const n = Number(raw);
      arr.push(Number.isInteger(n) ? n : NaN);
    }
  }
  return arr;
}

function validateArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!Number.isInteger(v) || v < 0 || v > 10)
      return { ok: false, index: i + 1 };
  }
  return { ok: true };
}

module.exports = async function submitTeacherRatings(req, res) {
  try {
    const userName =
      req.session?.user?.name || (req.body.userName || "").trim();
    if (!userName) return res.redirect("/login");

    const msValues = collectCategory("toc", req.body);
    const szValues = collectCategory("hci", req.body);
    const rsValues = collectCategory("dbms", req.body);
    const mvValues = collectCategory("si", req.body);
    const bdValues = collectCategory("bc", req.body);

    // Validate all arrays
    const validations = [
      { name: "TOC", arr: msValues },
      { name: "HCI", arr: szValues },
      { name: "DBMS", arr: rsValues },
      { name: "SI", arr: mvValues },
      { name: "BC", arr: bdValues },
    ];

    for (const { name, arr } of validations) {
      const validation = validateArray(arr);
      if (!validation.ok) {
        return res.render("button1", {
          user: req.session.user,
          error: `Invalid rating in ${name} at position ${validation.index}. Ratings must be integer 0-10.`,
          success: null,
        });
      }
    }

    // Check last submission
    const last = await evaluationModel.getLastSubmission(userName);
    if (last) {
      const lastSubmissionTime = new Date(last.submission_time);
      const daysDiff = (Date.now() - lastSubmissionTime) / (86400000); // 1000*60*60*24
      if (daysDiff < 180) {
        const daysLeft = Math.ceil(180 - daysDiff);
        return res.render("button1", {
          user: req.session.user,
          error: `You already submitted. You can submit again in ${daysLeft} day(s).`,
          success: null,
        });
      }
    }

    // Insert evaluations
    await evaluationModel.insertEvaluations(
      userName,
      msValues,
      szValues,
      rsValues,
      mvValues,
      bdValues
    );

    return res.render("submitted");
  } catch (err) {
    console.error("SUBMISSION ERROR:", err);
    return res.render("button1", {
      user: req.session.user,
      error: "Database error. Please try again later.",
      success: null,
    });
  }
};