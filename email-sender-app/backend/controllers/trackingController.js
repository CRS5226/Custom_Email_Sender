// backend/controllers/trackingController.js
const Email = require("../models/emailModel");
const mongoose = require("mongoose");

exports.trackOpen = async (req, res) => {
  const { emailId } = req.query; // Get the email ID from the query parameters

  try {
    // Update the email document to mark it as opened
    const result = await Email.updateOne(
      { _id: mongoose.Types.ObjectId(emailId) }, // Ensure you have the email ID
      { 
        opened: true, // Mark as opened
        delivery_status: "opened" // Update delivery status to opened
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: "Email not found or already opened." });
    }

    // Send a 1x1 pixel image as a response
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from([0, 0, 0, 0])); // Send a transparent pixel
  } catch (error) {
    console.error("Error tracking email open:", error);
    res.status(500).json({ error: error.message });
  }
};