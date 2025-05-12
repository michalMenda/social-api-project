const dal = require('../DAL/dal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { log } = require('../utils/logger');

const SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

// 🔐 יצירת Access Token
function createAccessToken(user, ip) {
    return jwt.sign(
        { id: user.id, email: user.email, ip },
        SECRET,
        { expiresIn: '15m' }
    );
}

// 🔐 יצירת Refresh Token
function createRefreshToken(user, ip) {
    return jwt.sign(
        { id: user.id, email: user.email, ip },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

// 🧠 שליחת טוקנים ללקוח
function sendAuthTokens(res, user, ip) {
    const accessToken = createAccessToken(user, ip);
    const refreshToken = createRefreshToken(user, ip);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user, accessToken });
}

// יצירת רשומה כללית
async function createItem(table, data) {
    if (!data || Object.keys(data).length === 0) {
        log(`[CREATE FAILED] No data provided`, { table });
        throw new Error('Data is required');
    }
    const result = await dal.create(table, data);
    log(`[CREATE] Item created`, { table, data });
    return result;
}

// שליפה עם סינון
async function getAllItems(table, filters = {}) {
    log(`[GET ALL]`, { table, filters });
    return dal.getAll(table, filters);
}



// עדכון
async function updateItem(table, id, data) {
    log(`[UPDATE]`, { table, id, data });
    return dal.update(table, id, data);
}

// מחיקה
async function deleteItem(table, id) {
    log(`[DELETE]`, { table, id });
    return dal.remove(table, id);
}

// התחברות
async function loginUser(email, password) {
    log(`[LOGIN ATTEMPT]`, { email });
    const user = await dal.getUserWithPassword(email);
    if (!user) {
        log(`[LOGIN FAILED] Email not found`, { email });
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        log(`[LOGIN FAILED] Wrong password`, { email });
        throw new Error('Incorrect password');
    }

    log(`[LOGIN SUCCESS]`, { userId: user.id });
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// הרשמה
async function registerUser(userData) {
    const { password, ...userFields } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    const user_id = await dal.createUserWithPasswordHash(userFields, password_hash);
    log(`[REGISTER] New user registered`, { userId: user_id, ...userFields });
    return { id: user_id, ...userFields };
}

module.exports = {
    createItem,
    getAllItems,
    updateItem,
    deleteItem,
    loginUser,
    registerUser,
    createAccessToken,
    createRefreshToken,
    sendAuthTokens
};
