const dal = require('../DAL/dal');
const bcrypt = require('bcrypt');


// יצירת רשומה
async function createItem(table, data) {
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Data is required');
    }
    return dal.create(table, data);
}

// שליפה עם סינון לפי query
async function getAllItems(table, filters = {}) {
    return dal.getAll(table, filters);
}


// שליפה לפי ID
async function getItemById(table, id) {
    return dal.getById(table, id);
}

// עדכון
async function updateItem(table, id, data) {
    return dal.update(table, id, data);
}

// מחיקה
async function deleteItem(table, id) {
    return dal.remove(table, id);
}
//כניסת משתמש

async function loginUser(email, password) {
    console.log('email:', email);
    console.log('Password:', password);
    const user = await dal.getUserWithPassword(email);
    if (!user) {
        throw new Error('User not found');
    }
    console.log('Hash from DB:', user.password_hash);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function registerUser(userData) {
    const { password, ...userFields } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    const user_id = await dal.createUserWithPasswordHash(userFields, password_hash);

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
