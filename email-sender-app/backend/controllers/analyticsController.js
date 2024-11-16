// backend/controllers/analyticsController.js
const Email = require("../models/emailModel");

exports.getEmailAnalytics = async (req, res) => {
  try {
    const totalEmails = await Email.countDocuments();
    const sentEmails = await Email.countDocuments({ status: "sent" });
    const pendingEmails = await Email.countDocuments({ status: "pending" });
    const failedEmails = await Email.countDocuments({ status: "failed" });
    const scheduledEmails = await Email.countDocuments({
      scheduled_time: { $ne: null },
    });

    const responseRate = sentEmails > 0 ? (sentEmails / totalEmails) * 100 : 0;

    res.status(200).json({
      totalEmails,
      sentEmails,
      pendingEmails,
      failedEmails,
      scheduledEmails,
      responseRate,
    });
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    res.status(500).json({ error: "Error fetching analytics" });
  }
};
