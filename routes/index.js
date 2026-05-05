const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const topicService = require('../services/topicService');
const { readDb } = require('../services/dbService');
const { sendRevisionEmail } = require('../services/emailService');

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
    const db = readDb();
    const user = db.users.find(u => u.id === req.session.userId);
    const topics = topicService.getTopics(req.session.userId);
    const dueTopics = topicService.getDueTopics(req.session.userId);
    res.render('dashboard', { user, topics, dueTopics });
});

router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', (req, res) => {
    try {
        const user = authService.login(req.body.email, req.body.password);
        req.session.userId = user.id;
        res.redirect('/');
    } catch (err) {
        res.render('login', { error: err.message });
    }
});

router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', (req, res) => {
    try {
        authService.register(req.body.email, req.body.password);
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: err.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/topics', isAuthenticated, (req, res) => {
    topicService.addTopic(req.session.userId, req.body.name, req.body.dateLearned);
    res.redirect('/');
});

router.post('/topics/:id/complete', isAuthenticated, (req, res) => {
    topicService.markCompleted(req.session.userId, req.params.id, parseInt(req.body.interval));
    res.redirect('/');
});

router.get('/test-email', async (req, res) => {
    try {
        await sendRevisionEmail(
            process.env.EMAIL_USER,
            [{ name: "Test Topic", dueInterval: 1 }]
        );

        res.send("Email sent successfully!");
    } catch (error) {
        console.error(error);
        res.send(error.message);
    }
});


// Public route for cron-job.org to trigger the reminders
// router.get('/cron-trigger', async (req, res) => {
//     try {
//         // You can manually trigger your cron logic here if needed
//         const { checkAndSendReminders } = require('../services/cronService');
//         await checkAndSendReminders();
//         res.status(200).send("Cron triggered successfully");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Cron trigger failed");
//     }
// });

router.get('/cron-trigger', (req, res) => {
    res.status(200).send("OK");
    const { checkAndSendReminders } = require('../services/cronService');

    checkAndSendReminders()
        .then(() => console.log("Cron job done"))
        .catch(err => console.error("Cron error:", err));
});


module.exports = router;