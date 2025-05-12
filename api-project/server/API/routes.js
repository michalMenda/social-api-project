const express = require('express');
const bl = require('../BL/logic');

function createGenericRouter(table) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const query = { ...req.query };
            if (query.user_id === 'null' && req.user && req.user.id) {
                query.user_id = req.user.id;
            }
            const items = await bl.getAllItems(table, query);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const item = await bl.getItemById(table, req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const body = { ...req.body };
            if (body.user_id === 'null' && req.user && req.user.id) {
                body.user_id = req.user.id;
            }
            const newItem = await bl.createItem(table, body);
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    

    router.put('/:id', async (req, res) => {
        try {
            const body = { ...req.body };
            if ((body.user_id === 'null' || body.user_id === null) && req.user && req.user.id) {
                body.user_id = req.user.id;
            }
    
            await bl.updateItem(table, req.params.id, body);
            res.json({ message: `${table.slice(0, -1)} updated` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    

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
