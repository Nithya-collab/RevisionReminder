const bcrypt = require('bcryptjs');
const { readDb, writeDb } = require('./dbService');

const register = (email, password) => {
    const db = readDb();
    if (db.users.find(u => u.email === email)) {
        throw new Error('User already exists');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        streak: 0,
        lastRevisionDate: null
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
};

const login = (email, password) => {
    const db = readDb();
    const user = db.users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid email or password');
    }
    return user;
};

module.exports = { register, login };