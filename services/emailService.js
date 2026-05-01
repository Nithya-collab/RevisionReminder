const nodemailer = require('nodemailer');
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
//      tls: {
//         family: 4   //  FORCE IPv4 (this fixes ENETUNREACH)
//     }
// });


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Do not fail on invalid certs / strict routing
    rejectUnauthorized: false
  }
});

const sendRevisionEmail = (to, topics) => {
    let body = '';
    if (topics.length > 0) {
        body = topics.map(t => `Topic: ${t.name} (Day ${t.dueInterval})`).join('\n');
    } else {
        body = 'No revision scheduled today. Stay consistent.';
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Today's Revision Plan",
        text: body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendRevisionEmail };