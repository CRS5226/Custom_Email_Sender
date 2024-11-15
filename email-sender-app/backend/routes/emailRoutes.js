// backend/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const emailController = require('../controllers/emailController');
const groqController = require('../controllers/groqController');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({ storage: storage });

// Use the multer middleware in the route
router.post('/upload', upload.single('file'), emailController.uploadCSV);

// Route to generate messages
router.post('/generate-message', groqController.generateMessage);

// New route to send emails
router.post('/send', async (req, res) => {
    const { emailData, generatedMessages } = req.body;

    try {
        await emailController.sendEmails(emailData, generatedMessages);
        res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;