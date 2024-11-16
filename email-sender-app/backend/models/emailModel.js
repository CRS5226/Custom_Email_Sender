// backend/models/emailModel.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  recipient_email: { type: String, required: true },
  subject: { type: String },
  body: { type: String },
  scheduled_time: { type: Date },
  status: { type: String, default: "pending" },
  delivery_status: { type: String, default: "pending" }, // "delivered", "opened", "bounced"
  opened: { type: Boolean, default: false }, // Track if the email was opened
  created_at: { type: Date, default: Date.now },
  companyName: { type: String }, 
  firstName: { type: String }, 
  lastName: { type: String }, 
  location: { type: String }, 
  products: { type: [String] }
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
