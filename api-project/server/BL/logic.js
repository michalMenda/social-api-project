const dal = require('../DAL/dal');

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

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};
