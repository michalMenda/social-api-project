const dal = require('../DAL/dal');
const bcrypt = require('bcrypt');
const { log } = require('../utils/logger');

// יצירת רשומה
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

// שליפה לפי ID
async function getItemById(table, id) {
    log(`[GET BY ID]`, { table, id });
    return dal.getById(table, id);
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
    getItemById,
    updateItem,
    deleteItem,
    loginUser,
    registerUser,
};
