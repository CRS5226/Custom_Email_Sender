import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse"; // Import PapaParse for CSV parsing

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [sendStatus, setSendStatus] = useState("");

  // Fetch email statuses on component mount
  useEffect(() => {
    const fetchEmailStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/emails/status");
        setEmails(response.data);
      } catch (error) {
        console.error("Error fetching email statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailStatuses();
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // Assuming the CSV has the correct structure
        const newEmails = results.data.map((row) => ({
          recipient_email: row.email, // Assuming 'email' is a field in your CSV
          subject: `Hello, ${row.firstName}`, // Customize as needed
          body: row.body || "Default message", // Default message if not provided
          status: "pending", // Default status
        }));

        setEmails((prevEmails) => [...prevEmails, ...newEmails]);
        // Optionally, send the emails to the server for saving in the database
        // axios.post("http://localhost:5000/api/emails/upload", newEmails);
      },
    });
  };

  const handleSendEmails = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/emails/send", {
        emailData: emails,
      });
      setSendStatus("Emails sent successfully!");
      // Update the emails state to reflect sent status
      setEmails((prevEmails) =>
        prevEmails.map((email) => ({ ...email, status: "sent" }))
      );
    } catch (error) {
      console.error("Error sending emails:", error);
      setSendStatus("Error sending emails: " + (error.message || "Unknown error"));
    }
  };

  const totalEmails = emails.length;
  const sentEmails = emails.filter((email) => email.status === "sent").length;
  const scheduledEmails = emails.filter((email) => email.status === "pending").length; // Assuming "pending" means scheduled
  const progress = totalEmails ? (sentEmails / totalEmails) * 100 : 0;

  return (
    <div>
      <h1>Email Status Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload CSV</button>
          <button onClick={handleSendEmails}>Send Emails</button>
          <p>{sendStatus}</p>
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Delivery Status</th>
                <th>Opened</th>
                <th>Sent Email</th> {/* New column for Sent Email */}
                <th>Scheduled Email</th> {/* New column for Scheduled Email */}
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr key={index}>
                  <td>{email.companyName}</td>
                  <td>{email.recipient_email}</td>
                  <td>{email.status}</td>
                  <td>{email.delivery_status || "N/A"}</td>
                  <td>{email.opened ? "Yes" : "No"}</td>
                  <td>{email.status === "sent" ? "Yes" : "No"}</td> {/* Sent Email status */}
                  <td>{email.status === "pending" ? "Yes" : "No"}</td> {/* Scheduled Email status */}
                </tr>
              ))}
            </ tbody>
          </table>
        </div>
      )}
      <div>
        <h2>Sending Progress: {progress.toFixed(2)}%</h2>
        <div style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#76c7c0",
              height: "20px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;