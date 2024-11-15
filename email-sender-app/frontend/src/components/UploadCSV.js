// frontend/src/components/UploadCSV.js
import React, { useState } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

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
      setData(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h2>Upload Email Data</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {data.length > 0 && (
        <div>
          <h3>Uploaded Data:</h3>
          <ul>
            {data.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
