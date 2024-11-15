// backend/models/emailModel.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  recipient_email: { type: String, required: true },
  subject: { type: String },
  body: { type: String },
  scheduled_time: { type: Date },
  status: { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
