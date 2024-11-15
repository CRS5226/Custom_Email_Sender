// frontend/src/components/ConnectGoogleSheet.js
import React, { useState } from "react";

const ConnectGoogleSheet = () => {
  const [sheetUrl, setSheetUrl] = useState("");

  const handleConnect = () => {
    if (sheetUrl) {
      alert(`Connecting to Google Sheet: ${sheetUrl}`);
      // Implement Google Sheets API call here
    } else {
      alert("Please enter a valid Google Sheet URL.");
    }
  };

  return (
    <div>
      <h2>Connect Google Sheet</h2>
      <input
        type="text"
        placeholder="Enter Google Sheet URL"
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default ConnectGoogleSheet;
