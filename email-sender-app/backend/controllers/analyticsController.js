// backend/controllers/analyticsController.js
const Email = require("../models/emailModel");

exports.getEmailAnalytics = async (req, res) => {
  try {
    // Extract startDate and endDate from query parameters
    const { startDate, endDate } = req.query;

    // Create a date filter based on the provided dates
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate); // Greater than or equal to startDate
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate); // Less than or equal to endDate
    }

    const totalEmails = await Email.countDocuments(dateFilter);
    const sentEmails = await Email.countDocuments({
      status: "sent",
      ...dateFilter,
    });
    const pendingEmails = await Email.countDocuments({
      status: "pending",
      ...dateFilter,
    });
    const failedEmails = await Email.countDocuments({
      status: "failed",
      ...dateFilter,
    });
    const scheduledEmails = await Email.countDocuments({
      scheduled_time: { $ne: null },
      ...dateFilter,
    });

    const responseRate = sentEmails > 0 ? (sentEmails / totalEmails) * 100 : 0;

    // Fetch detailed email data
    const emailDetails = await Email.find(dateFilter).select({
      _id: 1,
      recipient_email: 1,
      body: 1,
      status: 1,
      delivery_status: 1,
      opened: 1,
      created_at: 1,
      companyName: 1,
      firstName: 1,
      lastName: 1,
      products: 1,
    });

    res.status(200).json({
      totalEmails,
      sentEmails,
      pendingEmails,
      failedEmails,
      scheduledEmails,
      responseRate,
      emailDetails, // Include detailed email data in the response
    });
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    res.status(500).json({ error: "Error fetching analytics" });
  }
};
