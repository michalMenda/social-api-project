const pool = require('../config/connection');

// Get all rows from a table (only active rows)
async function getAll(table) {
    const [rows] = await pool.query('SELECT * FROM ?? WHERE isActive = true', [table]);
    return rows;
}

// Get a single row by ID (only if active)
async function getById(table, id) {
    const [rows] = await pool.query('SELECT * FROM ?? WHERE id = ? AND isActive = true', [table, id]);
    return rows[0];
}

// Create a new row (default to active = true if not specified)
async function create(table, data) {
    if (data.isActive === undefined) {
        data.isActive = true;
    }
    const [result] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
    return result.insertId;
}

// Update an existing row
async function update(table, id, data) {
    await pool.query('UPDATE ?? SET ? WHERE id = ?', [table, data, id]);
}

// Soft delete a row (mark as inactive)
async function remove(table, id) {
    await pool.query('UPDATE ?? SET isActive = false WHERE id = ?', [table, id]);
}

module.exports = { getAll, getById, create, update, remove };
