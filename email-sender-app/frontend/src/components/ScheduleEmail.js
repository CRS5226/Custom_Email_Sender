// frontend/src/components/ScheduleEmail.js
import React, { useState } from "react";
import axios from "axios";

const ScheduleEmail = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [sendInterval, setSendInterval] = useState(0); // in minutes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailData = {
      recipient_email: recipient,
      subject,
      body,
      scheduled_time: new Date(scheduledTime),
      send_interval: sendInterval,
    };

    try {
      await axios.post("/api/emails/schedule", emailData);
      alert("Email scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling email:", error);
      alert("Failed to schedule email.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Recipient Email:</label>
        <input
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label>Body:</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div>
        <label>Scheduled Time:</label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Send Interval (minutes):</label>
        <input
          type="number"
          value={sendInterval}
          onChange={(e) => setSendInterval(e.target.value)}
        />
      </div>
      <button type="submit">Schedule Email</button>
    </form>
  );
};

export default ScheduleEmail;
