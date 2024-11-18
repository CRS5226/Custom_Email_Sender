
# Email Sender Application

This is a robust full-stack application for sending bulk emails, built using **ReactJS** for the frontend, **Node.js** for the backend, **MongoDB** for data storage, and **Mailgun** as the Email Service Provider (ESP). It also includes features for scheduling emails and throttling their delivery, although these aspects remain untested.

---

## Features

- **Compose and send bulk emails** to multiple recipients.
- **Schedule emails** for future delivery.
- **Throttling mechanism** to comply with ESP rate limits.
- Drag-and-drop support for uploading recipient lists in CSV format.
- User-friendly interface with real-time feedback.
- Secure storage of email credentials using MongoDB.

---

## Tech Stack

**Frontend**: ReactJS, Axios  
**Backend**: Node.js, Express  
**Database**: MongoDB  
**ESP**: Mailgun  

---

## Setup and Configuration

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)
- Mailgun account for email delivery.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/email-sender-app.git
cd email-sender-app
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file:
   Create a `.env` file in the `backend` directory and include:
   ```env
   PORT=5000
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   MAILGUN_API_KEY=your-mailgun-api-key
   MAILGUN_DOMAIN=your-mailgun-domain
   MAILGUN_FROM=Your-App-Name <your-email@example.com>
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

4. Access the application at:
   ```
   http://localhost:3000
   ```

---

## Configuration Details

### Obtaining and Configuring Mailgun API Keys
1. Log in to your [Mailgun account](https://www.mailgun.com/).
2. Navigate to **API Keys** in the dashboard.
3. Copy the `API Key` and `Domain Name`.
4. Paste these values in the `.env` file of the backend.

### Configuring Email Scheduling and Throttling
- **Scheduling**: Emails can be scheduled using a `schedule` field. This is handled by server-side logic implemented with `node-cron`.
- **Throttling**: A built-in throttling mechanism ensures email delivery stays within Mailgun's limits. This logic resides in the backend (`scheduler.js`).

---

## Usage

1. Launch the application using the setup instructions.
2. In the UI:
   - Compose an email by entering a subject, body, and recipient addresses (bulk upload supported via CSV).
   - Optionally set a date and time for scheduling emails.
3. Click **Send** to deliver the emails immediately or schedule them for later.

---

## Limitations
- The email scheduling and throttling logic is implemented but has **not been tested**.
- Contributions are welcome to improve and validate these features.

---

## Folder Structure

```
email-sender-app/
├── backend/
│   ├── server.js          # Main backend server logic
│   ├── scheduler.js       # Email scheduling and throttling logic
│   ├── models/            # MongoDB models
│   ├── routes/            # Backend API routes
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main React app logic
│   └── package.json       # Frontend dependencies
├── README.md
```

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

--- 
