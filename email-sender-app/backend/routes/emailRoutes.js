// backend/routes/emailRoutes.js
const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/upload", emailController.uploadCSV);

module.exports = router;
