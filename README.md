# Daily Revision Reminder

A web application to help you track study topics and receive daily revision reminders based on spaced repetition (1, 3, 7, 14, 30 days).

## Features
- **Multi-User Auth**: Register and log in to track your own topics.
- **Spaced Repetition**: Automatic calculation of revision due dates.
- **Email Reminders**: Twice-daily summary emails (10:00 AM & 3:00 PM).
- **Streak Tracking**: Stay motivated by completing daily revisions.
- **Mark as Completed**: Track which revisions you've finished.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Update `EMAIL_USER` and `EMAIL_PASS` with your Gmail credentials.
   - *Note*: Use a [Gmail App Password](https://support.google.com/accounts/answer/185833) if you have 2FA enabled.

3. **Run the Application**:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   node server.js
   ```

4. **Access the App**:
   Open `http://localhost:3000` in your browser.

## How it Works
- Add a topic and the date you learned it.
- The app calculates if today is 1, 3, 7, 14, or 30 days since you learned it.
- If it matches, the topic appears in your "Due Today" list.
- An email summary is sent to you at 10 AM and 3 PM every day.
