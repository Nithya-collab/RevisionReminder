require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initCron } = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'revision-reminder-secret',
    resave: false,
    saveUninitialized: false
}));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start Cron
initCron();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});