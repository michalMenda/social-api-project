// genericRouter.js
const express = require('express');
const bl = require('./BL/logic');  // מניח שהלוגיקה בתיקיית BL

/**
 * יוצרת ראוטר גנרי לטבלה
 * @param {string} table - שם הטבלה (users, posts וכו׳)
 * @returns {Router} - אובייקט Express Router
 */
function createGenericRouter(table) {
    const router = express.Router();

    // GET all (תומך בסינון עם query כמו ?user_id=1)
    router.get('/', async (req, res) => {
        try {
            const items = await bl.getAllItems(table, req.query);  // שולח את כל ה-query
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET by ID
    router.get('/:id', async (req, res) => {
        try {
            const item = await bl.getItemById(table, req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // CREATE
    router.post('/', async (req, res) => {
        try {
            const newId = await bl.createItem(table, req.body);
            res.status(201).json({ id: newId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // UPDATE
    router.put('/:id', async (req, res) => {
        try {
            await bl.updateItem(table, req.params.id, req.body);
            res.json({ message: `${table.slice(0, -1)} updated` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE
    router.delete('/:id', async (req, res) => {
        try {
            await bl.deleteItem(table, req.params.id);
            res.json({ message: `${table.slice(0, -1)} deleted` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

module.exports = createGenericRouter;
