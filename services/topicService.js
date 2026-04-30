const { DateTime } = require('luxon');
const { readDb, writeDb } = require('./dbService');

const INTERVALS = [1, 3, 7, 14, 30];

const addTopic = (userId, name, dateLearned) => {
    const db = readDb();
    const newTopic = {
        id: Date.now().toString(),
        userId,
        name,
        dateLearned: dateLearned || DateTime.now().toISODate(),
        completedIntervals: []
    };
    db.topics.push(newTopic);
    writeDb(db);
    return newTopic;
};

const getTopics = (userId) => {
    const db = readDb();
    return db.topics.filter(t => t.userId === userId);
};

const getDueTopics = (userId) => {
    const db = readDb();
    const userTopics = db.topics.filter(t => t.userId === userId);
    const today = DateTime.now().startOf('day');

    return userTopics.map(topic => {
        const learnedDate = DateTime.fromISO(topic.dateLearned).startOf('day');
        const diff = today.diff(learnedDate, 'days').days;
        const daysPassed = Math.floor(diff);

        if (INTERVALS.includes(daysPassed) && !topic.completedIntervals.includes(daysPassed)) {
            return { ...topic, dueInterval: daysPassed };
        }
        return null;
    }).filter(t => t !== null);
};

const markCompleted = (userId, topicId, interval) => {
    const db = readDb();
    const topic = db.topics.find(t => t.id === topicId && t.userId === userId);
    if (topic && !topic.completedIntervals.includes(interval)) {
        topic.completedIntervals.push(interval);
        
        // Update streak logic
        const user = db.users.find(u => u.id === userId);
        const today = DateTime.now().toISODate();
        if (user.lastRevisionDate !== today) {
            const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
            if (user.lastRevisionDate === yesterday) {
                user.streak += 1;
            } else {
                user.streak = 1;
            }
            user.lastRevisionDate = today;
        }
        
        writeDb(db);
    }
    return topic;
};

module.exports = { addTopic, getTopics, getDueTopics, markCompleted };