// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/emails", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
