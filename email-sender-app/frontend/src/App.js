// frontend/src/App.js
import React from "react";
import UploadCSV from "./components/UploadCSV";
import ConnectGoogleSheet from "./components/ConnectGoogleSheet";
import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <h1>Email Sender Application</h1>
      <UploadCSV />
      <ConnectGoogleSheet />
    </div>
  );
};

export default App;
