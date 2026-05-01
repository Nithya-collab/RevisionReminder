const nodemailer = require('nodemailer');
require('dotenv').config();
// Replace the old nodemailer stuff at the top with this:
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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


// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // Must be false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     // Do not fail on invalid certs / strict routing
//     rejectUnauthorized: false
//   }
// });

// const sendRevisionEmail = (to, topics) => {
//     let body = '';
//     if (topics.length > 0) {
//         body = topics.map(t => `Topic: ${t.name} (Day ${t.dueInterval})`).join('\n');
//     } else {
//         body = 'No revision scheduled today. Stay consistent.';
//     }

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: to,
//         subject: "Today's Revision Plan",
//         text: body
//     };

//     return transporter.sendMail(mailOptions);
// };


const sendRevisionEmail = async (to, topics) => {
    let htmlBody = '';
    
    // 1. Build the email body using HTML
    if (topics.length > 0) {
        htmlBody = topics.map(t => `<p>Topic: <b>${t.name}</b> (Day ${t.dueInterval})</p>`).join('');
    } else {
        htmlBody = '<p>No revision scheduled today. Stay consistent. 🔥</p>';
    }

    // 2. Send the email using Resend
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',   // Resend's required testing address
            to: to,                          // The recipient passed into the function
            subject: "Today's Revision Plan",// Your original subject line
            html: htmlBody                   // The compiled HTML body from above
        });
        
        console.log("Email sent successfully via Resend!", data);
        return true; 
    } catch (error) {
        console.error("Resend Error:", error);
        return false;
    }
};

module.exports = { sendRevisionEmail };