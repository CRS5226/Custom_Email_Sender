// frontend/src/components/UploadCSV.js
// import React, { useState } from "react";
// import axios from "axios";

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/emails/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setData(response.data);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Email Data</h2>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload CSV</button>
//       {data.length > 0 && (
//         <div>
//           <h3>Uploaded Data:</h3>
//           <ul>
//             {data.map((row, index) => (
//               <li key={index}>{JSON.stringify(row)}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCSV;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import axios from "axios";
// import Papa from "papaparse"; // Import PapaParse

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     // Use PapaParse to parse the CSV file
//     Papa.parse(file, {
//       header: true, // Set to true to use the first row as header
//       dynamicTyping: true, // Automatically convert numeric values to numbers
//       complete: (results) => {
//         setData(results.data); // Set the parsed data to state
//       },
//       error: (error) => {
//         console.error("Error parsing CSV:", error);
//       },
//     });
//   };

//   const handleChange = (rowIndex, columnKey, value) => {
//     const newData = [...data];
//     newData[rowIndex][columnKey] = value;
//     setData(newData);
//   };

//   return (
//     <div>
//       <h2>Upload Email Data</h2>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload CSV</button>
//       {data.length > 0 && (
//         <div>
//           <h3>Uploaded Data:</h3>
//           <table>
//             <thead>
//               <tr>
//                 {Object.keys(data[0]).map((key) => (
//                   <th key={key}>{key}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Object.keys(row).map((key) => (
//                     <td key={key}>
//                       <input
//                         type="text"
//                         value={row[key]}
//                         onChange={(e) =>
//                           handleChange(rowIndex, key, e.target.value)
//                         }
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCSV;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import axios from "axios";

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState([]);
//   const [prompt, setPrompt] = useState(""); // State to hold the customizable prompt
//   const [generatedMessages, setGeneratedMessages] = useState([]); // State to hold generated messages

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/emails/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setData(response.data); // Store the uploaded data
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleGenerateMessages = async () => {
//     const messages = [];
//     for (const row of data) {
//       let messagePrompt = prompt;
//       for (const key in row) {
//         const placeholder = `{${key}}`;
//         messagePrompt = messagePrompt.replace(
//           new RegExp(placeholder, "g"),
//           row[key]
//         );
//       }

//       try {
//         const response = await axios.post(
//           "http://localhost:5000/api/emails/generate-message",
//           {
//             prompt: messagePrompt,
//           }
//         );
//         messages.push(response.data);
//       } catch (error) {
//         console.error("Error generating message:", error);
//         messages.push(
//           "Error generating message: " + (error.message || "Unknown error")
//         );
//       }
//     }
//     setGeneratedMessages(messages);
//   };

//   return (
//     <div>
//       <h2>Upload Email Data</h2>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload CSV</button>

//       {/* Display Uploaded Data */}
//       {data.length > 0 && (
//         <div>
//           <h3>Uploaded Data:</h3>
//           <ul>
//             {data.map((row, index) => (
//               <li key={index}>{JSON.stringify(row)}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Prompt Box for customizable prompt */}
//       <div>
//         <h3>Customizable Prompt</h3>
//         <textarea
//           placeholder="Enter your prompt here (e.g., Dear {First Name}, welcome to {Company Name}!"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           rows="4"
//           cols="50"
//         />
//         <button onClick={handleGenerateMessages}>Generate Messages</button>
//       </div>

//       {/* Display generated messages */}
//       {generatedMessages.length > 0 && (
//         <div>
//           <h3>Generated Messages:</h3>
//           <ul>
//             {generatedMessages.map((message, index) => (
//               <li key={index}>{message}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCSV;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [prompt, setPrompt] = useState(""); // State to hold the customizable prompt
  const [generatedMessages, setGeneratedMessages] = useState([]); // State to hold generated messages
  const [sendStatus, setSendStatus] = useState(""); // State to hold the status of email sending

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
          row[key] || '' // Fill with empty string if the value is undefined
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
      const emailData = data.map((row, index) => ({
        to: row.email, // Assuming 'email' is a field in your CSV
        firstName: row.firstName, // Assuming 'firstName' is a field in your CSV
        lastName: row.lastName, // Assuming 'lastName' is a field in your CSV
      }));

      console.log(emailData)
  
      // Send the email data and generated messages to the backend
      const response = await axios.post(
        "http://localhost:5000/api/emails/send",
        { emailData, generatedMessages }
      );
  
      setSendStatus("Emails sent successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error sending emails:", error);
      setSendStatus(
        "Error sending emails: " + (error.message || "Unknown error")
      );
    }
  };

  return (
    <div>
      <h2>Upload Email Data</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>

      {/* Display Uploaded Data */}
      {data.length > 0 && (
        <div>
          <h3>Uploaded Data:</h3>
          <ul>
            {data.map((row, index) => (
              <li key={index }>
                {JSON.stringify(row)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input for Custom Prompt */}
      <div>
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
        <div>
          <h3>Generated Messages:</h3>
          <ul>
            {generatedMessages.map((message, index) => (
              <li key={index}>
                <strong>Message for {data[index]?.firstName || 'Recipient'}:</strong>
                <div style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>{message}</div>
                {/* Preserve formatting and add some margin for better readability */}
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