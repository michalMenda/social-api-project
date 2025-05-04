const pool = require('../config/connection');

// Get all rows from a table
async function getAll(table) {
    const [rows] = await pool.query('SELECT * FROM ??', [table]);
    return rows;
}

// Get a single row by ID
async function getById(table, id) {
    const [rows] = await pool.query('SELECT * FROM ?? WHERE id = ?', [table, id]);
    return rows[0];
}

// Create a new row
async function create(table, data) {
    const [result] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
    return result.insertId;
}

// Update an existing row
async function update(table, id, data) {
    await pool.query('UPDATE ?? SET ? WHERE id = ?', [table, data, id]);
}

// Delete a row
async function remove(table, id) {
    await pool.query('DELETE FROM ?? WHERE id = ?', [table, id]);
}

module.exports = { getAll, getById, create, update, remove };
