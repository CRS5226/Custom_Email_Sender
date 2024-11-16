// frontend/src/components/AnalyticsDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalEmails: 0,
    sentEmails: 0,
    pendingEmails: 0,
    failedEmails: 0,
    scheduledEmails: 0,
    responseRate: 0,
  });

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/emails/analytics"
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 60000); // Update every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>Email Analytics Dashboard</h2>
      <div>
        <h3>Total Emails Sent: {analytics.sentEmails}</h3>
        <h3>Pending Emails: {analytics.pendingEmails}</h3>
        <h3>Scheduled Emails: {analytics.scheduledEmails}</h3>
        <h3>Failed Emails: {analytics.failedEmails}</h3>
        <h3>Response Rate: {analytics.responseRate.toFixed(2)}%</h3>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
