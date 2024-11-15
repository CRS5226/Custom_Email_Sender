// backend/controllers/emailController.js
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.uploadCSV = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
      fs.unlinkSync(req.file.path); // Delete the file after processing
    });
};
