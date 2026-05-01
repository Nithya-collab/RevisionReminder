const cron = require('node-cron');
const { readDb } = require('./dbService');
const { getDueTopics } = require('./topicService');
const { sendRevisionEmail } = require('./emailService');

// const initCron = () => {
//     // 10:00 AM
//     cron.schedule('0 10 * * *', async () => {
//         console.log('Running 10:00 AM Revision Cron');
//         await sendReminders();
//     });

//     // 3:00 PM
//     cron.schedule('0 15 * * *', async () => {
//         console.log('Running 3:00 PM Revision Cron');
//         await sendReminders();
//     });
// };

const initCron = () => {
    // 10:00 AM IST
    cron.schedule('0 10 * * *', async () => {
        console.log('Running 10:00 AM Revision Cron');
        await sendReminders();
    }, {
        timezone: "Asia/Kolkata"
    });

    // 3:00 PM IST
    cron.schedule('0 15 * * *', async () => {
        console.log('Running 3:00 PM Revision Cron');
        await sendReminders();
    }, {
        timezone: "Asia/Kolkata"
    });
};

const sendReminders = async () => {
    const db = readDb();
    for (const user of db.users) {
        try {
            const dueTopics = getDueTopics(user.id);
            await sendRevisionEmail(user.email, dueTopics);
            console.log(`Email sent to ${user.email}`);
        } catch (err) {
            console.error(`Failed to send email to ${user.email}:`, err);
        }
    }
};

module.exports = { initCron };