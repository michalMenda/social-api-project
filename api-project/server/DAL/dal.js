const pool = require('../config/connection');

// Get all rows from a table (only active rows)
// Get all rows from a table (only active rows, with optional filters)
async function getAll(table, filters = {}) {
    let sql = 'SELECT * FROM ?? WHERE isActive = true';
    const params = [table];

    for (const key in filters) {
        // מוסיפים את השם ישירות לשאילתה (שימי לב לשדה ידוע בלבד)
        sql += ` AND ${key} = ?`;
        params.push(filters[key]);
    }

    console.log('SQL:', sql);
    console.log('Params:', params);

    const [rows] = await pool.query(sql, params);
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
