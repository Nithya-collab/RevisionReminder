# Daily Revision Reminder Plan

## 1. Objective
Build a web application that helps users manage their study topics by sending daily summary emails for topics due for revision based on spaced repetition intervals (1, 3, 7, 14, 30 days). The app will feature multi-user support (using EJS templates and session-based authentication), a JSON file for data storage, and scheduled email reminders via Nodemailer and node-cron. It will also include "Mark as Completed" and "Track Streak" features.

## 2. Key Files & Architecture
- **`package.json`**: Project dependencies (`express`, `ejs`, `express-session`, `bcryptjs`, `node-cron`, `nodemailer`, `dotenv`).
- **`server.js`**: Main entry point; sets up Express, middleware, sessions, and initializes cron jobs.
- **`data/db.json`**: The JSON database storing users and their topics.
- **`services/dbService.js`**: Utility to read and write to `db.json` safely.
- **`services/emailService.js`**: Configures Nodemailer to send summary emails via Gmail SMTP.
- **`services/cronService.js`**: Contains the logic to find due topics for all users and schedule the node-cron jobs.
- **`routes/index.js`**: Defines the web routes (auth and topic management).
- **`views/`**: EJS templates for the UI (`layout.ejs`, `login.ejs`, `register.ejs`, `dashboard.ejs`).
- **`.env`**: Configuration for secrets (e.g., Gmail credentials, session secret).

## 3. Implementation Steps
1. **Project Setup**: Initialize project, install dependencies, and create the directory structure.
2. **Database Service**: Implement `dbService.js` to handle concurrent-safe (or basic synchronous) reads/writes to `db.json`.
3. **Authentication**: Build user registration and login flows using `bcryptjs` for password hashing and `express-session` for session management.
4. **Topic Management**: 
   - Build the UI and backend logic to add a topic with a specific "learned date".
   - Implement the logic to calculate whether a topic is due today based on the intervals (1, 3, 7, 14, 30 days).
   - Implement the "Mark as Completed" feature to track which revisions are done.
5. **Streak Tracking**: Implement logic to track consecutive days of activity (e.g., logging in or completing a revision).
6. **Email & Scheduler**:
   - Set up Nodemailer to format and send the "Today's Revision Plan" email.
   - Configure `node-cron` to run at 10:00 AM and 3:00 PM daily, gathering data for each user and sending emails.
7. **Frontend Views**: Create clean, responsive EJS templates to interact with the backend.

## 4. Verification & Testing
- Manually test user registration, login, and session persistence.
- Add topics with various past dates to verify the "due today" calculation.
- Test marking topics as completed and verify streak increments.
- Temporarily adjust cron schedules to `* * * * *` (every minute) to test email delivery.
- Ensure the app handles empty states gracefully (e.g., "No revision scheduled today").