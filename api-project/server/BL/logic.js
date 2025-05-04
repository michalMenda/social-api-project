const dal = require('../DAL/dal');

// לדוגמה: ולידציה פשוטה לפני יצירת רשומה
async function createItem(table, data) {
    // פה אפשר להוסיף חוקים – למשל בדיקות מיוחדות
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Data is required');
    }
    return dal.create(table, data);
}

// Get all
async function getAllItems(table) {
    return dal.getAll(table);
}

// Get by ID
async function getItemById(table, id) {
    return dal.getById(table, id);
}

// Update
async function updateItem(table, id, data) {
    return dal.update(table, id, data);
}

// Delete
async function deleteItem(table, id) {
    return dal.remove(table, id);
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};
