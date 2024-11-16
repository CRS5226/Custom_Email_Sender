// backend/routes/emailRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const emailController = require("../controllers/emailController");
const groqController = require("../controllers/groqController");
const webhookController = require("../controllers/webhookController");
const analyticsController = require("../controllers/analyticsController");
const trackingController = require("../controllers/trackingController");
const Email = require("../models/emailModel"); // Import the Email model


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Use the multer middleware in the route
router.post("/upload", upload.single("file"), emailController.uploadCSV);

// Route to generate messages
router.post("/generate-message", groqController.generateMessage);

router.get("/status", async (req, res) => {
  try {
    const emails = await Email.find(); // Fetch all emails
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching email statuses:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/analytics", analyticsController.getEmailAnalytics);

// Route to track email opens
router.get("/track-open", trackingController.trackOpen);

///////////////////////////////////////////////////////  THROTTLE //////////////////////////////////////////////////////////

// router.post("/send", async (req, res) => {
//   const { emailData, generatedMessages, throttleRate } = req.body; // Get data from the request

//   try {
//     await emailController.sendEmails(
//       emailData,
//       generatedMessages,
//       throttleRate
//     ); // Call the sendEmails function
//     res.status(200).json({ message: "Emails scheduled successfully!" });
//   } catch (error) {
//     console.error("Error scheduling emails:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

///////////////////////////////////////////////////////  OLD ONE //////////////////////////////////////////////////////////
// New route to send emails
router.post("/send", async (req, res) => {
  const { emailData, generatedMessages } = req.body;

  console.log("Sending email to:", emailData);

  try {
    await emailController.sendEmails(emailData, generatedMessages);
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook route for Mailgun
router.post("/webhook", webhookController.mailgunWebhook);

module.exports = router;
