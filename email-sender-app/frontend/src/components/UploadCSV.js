////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [prompt, setPrompt] = useState(""); // State to hold the customizable prompt
  const [generatedMessages, setGeneratedMessages] = useState([]); // State to hold generated messages
  const [sendStatus, setSendStatus] = useState(""); // State to hold the status of email sending
  const [scheduleTime, setScheduleTime] = useState(""); // State to hold the schedule time

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/emails/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data); // Store the uploaded data
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleGenerateMessages = async () => {
    const messages = [];
    for (const row of data) {
      let messagePrompt = prompt;

      // Replace placeholders with actual values from the row
      for (const key in row) {
        const placeholder = `{${key}}`;
        messagePrompt = messagePrompt.replace(
          new RegExp(placeholder, "g"),
          row[key] || "" // Fill with empty string if the value is undefined
        );
      }

      try {
        // Send the modified prompt to the backend for message generation
        const response = await axios.post(
          "http://localhost:5000/api/emails/generate-message",
          {
            prompt: messagePrompt,
          }
        );
        messages.push(response.data); // Store the generated message
      } catch (error) {
        console.error("Error generating message:", error);
        messages.push(
          "Error generating message: " + (error.message || "Unknown error")
        );
      }
    }
    setGeneratedMessages(messages); // Update the state with all generated messages
  };

  const handleSendEmails = async () => {
    try {
      // Prepare the data to send to the backend
      const emailData = data.map((row) => ({
        to: row.recipient_email, // Assuming 'email' is a field in your CSV
        firstName: row.firstName, // Assuming 'firstName' is a field in your CSV
        lastName: row.lastName, // Assuming 'lastName' is a field in your CSV
        scheduled_time: new Date(scheduleTime), // Schedule time for sending
        companyName: row.companyName,
        products: row.products,
      }));

      console.log(emailData);

      // Send the email data and generated messages to the backend
      const response = await axios.post(
        "http://localhost:5000/api/emails/send",
        { emailData, generatedMessages }
      );

      // Update the status of each email to "sent"
      // const updatedData = data.map((row) => ({
      //   ...row,
      //   status: "sent", // Change status to "sent"
      //   delivery_status: "pending", // Include delivery status
      //   opened: false, // Include opened status
      // }));
      // setData(updatedData);
      // setSendStatus("Emails sent successfully!");

      const updatedEmailsResponse = await axios.get(
        "http://localhost:5000/api/emails/status"
      );
      
      // console.log("email data", updatedEmailsResponse.data);
      // console.log("delivery data", updatedEmailsResponse.data.delivery_status);

      // const updatedData = data.map((row) => ({
      //   ...row,
      //   status: updatedEmailsResponse.data.status, // Change status to "sent"
      //   delivery_status: updatedEmailsResponse.data.delivery_status, // Include delivery status
      //   opened: updatedEmailsResponse.data.opened, // Include opened status
      // }));

      setData(updatedEmailsResponse.data); // Update the state with the latest email statuses
      // setData(updatedData);
      setSendStatus("Emails sent successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error sending emails:", error);
      setSendStatus(
        "Error sending emails: " + (error.message || "Unknown error")
      );
    }
  };

  // const handleTrackOpen = async (emailId) => {
  //   try {
  //     // Call the tracking endpoint with the email ID
  //     await axios.post(
  //       `http://localhost:5000/api/emails/track-open?emailId=${emailId}`
  //     );
  //     console.log(`Email with ID ${emailId} marked as opened.`);
  //   } catch (error) {
  //     console.error("Error tracking email open:", error);
  //   }
  // };

  return (
    <div>
      <div className="upload-email-data">
      <h2>Upload Email Data</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      </div>

      {/* Input for Schedule Time */}
      <div className="schedule-container">
        <h3>Schedule Time for Sending Emails:</h3>
        <input
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
      </div>

      {/* Display Uploaded Data */}
      {data.length > 0 && (
        <div className="uploaded-data">
          <h3>Uploaded Data:</h3>
          <ul>
            {data.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display dashboard */}
      {data.length > 0 && (
        <div className="dashboard-container">
          <h3>Dashboard</h3>
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Delivery Status</th>
                <th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.companyName || "N /A"}</td>
                  <td>{row.recipient_email || "N /A"} </td>
                  <td  className={`status-${row.status?.toLowerCase() || "pending"}`}>{row.status || "pending"}</td>
                  <td>{row.delivery_status || "N/A"}</td>
                  <td>{row.opened ? "Yes" : "No"}</td>
                  {/* <td>
                    <button onClick={() => handleTrackOpen(row.email)}>Track Open</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Input for Custom Prompt */}
      <div className="custom-prompt">
        <h3>Custom Prompt:</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Enter your prompt with placeholders like {firstName}, {lastName}, etc."
        />
      </div>

      <button onClick={handleGenerateMessages}>Generate Messages</button>

      {/* Display generated messages */}
      {generatedMessages.length > 0 && (
        <div className="generated-message">
          <h3>Generated Messages:</h3>
          <ul>
            {generatedMessages.map((message, index) => (
              <li key={index}>
                <strong>
                  Message for {data[index]?.firstName || "Recipient"}:
                </strong>
                <div style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>
                  {message}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSendEmails}>Send Emails</button>
      {sendStatus && <p>{sendStatus}</p>}
    </div>
  );
};

export default UploadCSV;
