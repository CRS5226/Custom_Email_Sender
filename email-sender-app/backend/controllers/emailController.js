// backend/controllers/emailController.js
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");
const mailgun = require("mailgun-js");
const Email = require("../models/emailModel"); // Import the Email model

const upload = multer({ dest: "uploads/" });

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.uploadCSV = (req, res) => {
  const results = [];

  // Check if the file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      res.json(results);
      fs.unlinkSync(req.file.path); // Delete the file after processing
    });
};

exports.mailgunWebhook = async (req, res) => {
  const eventData = req.body;

  // Check if the event is an 'opened' event
  if (eventData.event === "opened") {
    const emailId = eventData["recipient"];

    try {
      // Update the email record in the database to mark it as opened
      await Email.updateOne({ recipient_email: emailId }, { opened: true });
      console.log(`Email opened by: ${emailId}`);
    } catch (error) {
      console.error("Error updating email open status:", error);
    }
  }

  // Respond to Mailgun
  res.status(200).send("Webhook received");
};

///////////////////////////////////////////////// Function to schedule emails  //////////////////////////////////////////////////
// exports.scheduleEmails = async (emailData, throttleRate) => {
//   const scheduledEmails = emailData.map((email) => {
//     const newEmail = new Email({
//       recipient_email: email.to,
//       subject: `Hello, ${email.firstName}`,
//       body: email.body,
//       scheduled_time: new Date(email.scheduled_time), // assuming scheduled_time comes from CSV
//       status: "pending",
//     });
//     return newEmail;
//   });

//   for (const email of scheduledEmails) {
//     await email.save(); // Save the email to the database
//     const delay = email.scheduled_time.getTime() - Date.now(); // Calculate delay

//     if (delay > 0) {
//       // Schedule the email to be sent after the delay
//       setTimeout(() => sendEmail(email), delay);
//     } else {
//       // If the scheduled time is in the past, send immediately
//       await sendEmail(email);
//     }
//   }

//   // Throttling logic
//   if (throttleRate) {
//     const interval = (60 * 1000) / throttleRate; // Convert rate to milliseconds
//     let index = 0;

//     const sendNextEmail = () => {
//       if (index < scheduledEmails.length) {
//         sendEmail(scheduledEmails[index]);
//         index++;
//         setTimeout(sendNextEmail, interval); // Schedule the next email
//       }
//     };

//     sendNextEmail(); // Start sending emails
//   }
// };

// // Update sendEmails to accept emailData and generatedMessages
// exports.sendEmails = async (emailData, generatedMessages, throttleRate) => {
//   const emailsToSend = emailData.map((email, index) => ({
//     to: email.to, // Assuming 'to' is a field in your CSV
//     firstName: email.firstName,
//     body: generatedMessages[index] || "Default message", // Use generated message or default
//   }));

//   await this.scheduleEmails(emailsToSend, throttleRate); // Call scheduleEmails with throttle rate
// };

/////////////////////////////////////// 2nd VERSION //////////////////////////////////////////////////////

// Update sendEmails to accept emailData and generatedMessages with scheduling and throttling
// exports.sendEmails = async (emailData, generatedMessages, throttleRate) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // Use your email service
//     auth: {
//       user: process.env.EMAIL_USER, // Your email
//       pass: process.env.EMAIL_PASS, // Your email password
//     },
//   });

//   // Prepare emails to be sent
//   const emailsToSend = emailData.map((email, index) => ({
//     recipient_email: email.to, // Assuming 'to' is a field in your CSV
//     subject: `Hello, ${email.firstName}`, // Customize subject
//     body: generatedMessages[index] || "Default message", // Use generated message or default
//     scheduled_time: new Date(), // Set the current time as scheduled time
//     status: "pending", // Initial status
//   }));

//   // Schedule emails with throttling
//   const scheduleEmails = async (emails) => {
//     const interval = throttleRate ? (60 * 1000) / throttleRate : 0; // Convert rate to milliseconds
//     let index = 0;

//     const sendNextEmail = async () => {
//       if (index < emails.length) {
//         const email = emails[index];
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: email.recipient_email,
//           subject: email.subject,
//           text: email.body,
//         };

//         try {
//           await transporter.sendMail(mailOptions);
//           console.log(`Email sent to ${email.recipient_email}`);
//           email.status = "sent"; // Update status to sent
//         } catch (error) {
//           console.error(
//             `Error sending email to ${email.recipient_email}:`,
//             error
//           );
//           email.status = "failed"; // Update status to failed
//         }

//         await new Email(email).save(); // Save the email document to the database
//         index++;
//         setTimeout(sendNextEmail, interval); // Schedule the next email
//       }
//     };

//     sendNextEmail(); // Start sending emails
//   };

//   await scheduleEmails(emailsToSend); // Call the scheduling function
// };

//////

///////////////////////////////// OLD ONE /////////////////////////////////////////////////////////////////

// Update sendEmails to accept emailData and generatedMessages
// exports.sendEmails = async (emailData, generatedMessages) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // Use your email service
//     auth: {
//       user: process.env.EMAIL_USER, // Your email
//       pass: process.env.EMAIL_PASS, // Your email password
//     },
//   });

//   for (let i = 0; i < emailData.length; i++) {
//     const email = emailData[i];
//     const messageBody = generatedMessages[i] || "Default message"; // Use generated message or default

//     console.log(email);

//     // Create a new email document to store in MongoDB
//     const newEmail = new Email({
//       recipient_email: email.to, // Assuming 'to' is a field in your CSV
//       subject: `Hello, ${email.firstName}`, // Customize subject
//       body: messageBody, // Use the generated message as the body
//       scheduled_time: new Date(), // Set the current time as scheduled time
//       status: "pending", // Initial status
//     });

//     // Customize the email content for each recipient
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email.to, // Assuming 'to' is a field in your CSV
//       subject: `Hello, ${email.firstName}`, // Customize subject
//       text: messageBody, // Use the generated message as the body
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log(`Email sent to ${email.to}`);
//       newEmail.status = "sent";
//     } catch (error) {
//       console.error(`Error sending email to ${email.to}:`, error);
//       newEmail.status = "failed";
//     }

//     await newEmail.save();
//   }
// };

///////////////////////////////// MAINGUN ONE /////////////////////////////////////////////////////////////////
exports.sendEmails = async (emailData, generatedMessages) => {
  for (let i = 0; i < emailData.length; i++) {
    const email = emailData[i];
    const messageBody = generatedMessages[i] || "Default message"; // Use generated message or default

    const mailOptions = {
      from: process.env.MAILGUN_FROM, // Your Mailgun verified sending email
      // to: email.recipient_email,
      to: email.to,
      subject: email.subject,
      text: messageBody, // Use the generated message as the body
      "o:tracking": "yes", // Enable open tracking
      "o:tracking-clicks": "yes", // Optional: Enable click tracking
    };

    try {
      const response = await mg.messages().send(mailOptions);
      console.log(`Email sent to ${email.to}`);

      // Update email status in the database
      await Email.create({
        recipient_email: email.to,
        subject: email.subject,
        body: messageBody, // Store the generated message in the body
        status: "sent", // Update status to delivered
        delivery_status: "delivered", // Capture the response message
        opened: false, // Set opened status to false initially
        created_at: email.created_at,
        companyName: email.companyName,
        firstName: email.firstName,
        lastName: email.lastName,
        location: email.location,
        products: email.products,
      });
    } catch (error) {
      console.error(`Error sending email to ${email.to}:`, error);
      // Update email status in the database
      await Email.create({
        recipient_email: email.to,
        subject: email.subject,
        body: messageBody, // Store the generated message in the body
        status: "failed", // Update status to failed
        delivery_status: "bounced",
        opened: false,
        created_at: email.created_at,
        companyName: email.companyName,
        firstName: email.firstName,
        lastName: email.lastName,
        location: email.location,
        products: email.products,
      });
    }
  }
};
