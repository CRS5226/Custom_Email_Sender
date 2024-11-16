// frontend/src/App.js
import React from "react";
import UploadCSV from "./components/UploadCSV";
import ConnectGoogleSheet from "./components/ConnectGoogleSheet";
import ScheduleEmail from "./components/ScheduleEmail";
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import AnalyticsDashboard from "./components/AnalyticsDashboard"; // Import the dashboard


// import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <h1>Email Sender Application</h1>
      <UploadCSV />
      <AnalyticsDashboard />
      {/* <ScheduleEmail/> */}
      {/* <Dashboard /> */}
      {/* <ConnectGoogleSheet /> */}
    </div>
  );
};

export default App;
