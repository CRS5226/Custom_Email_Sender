// export default AnalyticsDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
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

  // Prepare data for the chart
  const chartData = {
    labels: [
      "Sent Emails",
      "Failed Emails",
      "Pending Emails",
      "Scheduled Emails",
    ],
    datasets: [
      {
        label: "Email Counts", // This can be changed to something like "Emails"
        data: [
          analytics.sentEmails,
          analytics.failedEmails,
          analytics.pendingEmails,
          analytics.scheduledEmails,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Sent Emails
          "rgba(255, 99, 132, 0.6)", // Failed Emails
          "rgba(255, 206, 86, 0.6)", // Pending Emails
          "rgba(153, 102, 255, 0.6)", // Scheduled Emails
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-dashboard">
      <h2>Email Analytics Dashboard</h2>
      <div className="analytics-summary">
        <h3>Total Emails Sent: {analytics.sentEmails}</h3>
        <h3>Pending Emails: {analytics.pendingEmails}</h3>
        <h3>Failed Emails: {analytics.failedEmails}</h3>
        <h3>Response Rate: {analytics.responseRate.toFixed(2)}%</h3>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
