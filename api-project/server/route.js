const express = require('express');
const router = express.Router();
const logic = require('./BL/logic');

// GET all
router.get('/:table', async (req, res) => {
    try {
        const data = await logic.getAllItems(req.params.table);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// GET by ID
router.get('/:table/:id', async (req, res) => {
    try {
        const data = await logic.getItemById(req.params.table, req.params.id);
        if (data) res.json(data);
        else res.status(404).json({ error: 'Not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// POST
router.post('/:table', async (req, res) => {
    try {
        const id = await logic.createItem(req.params.table, req.body);
        res.status(201).json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create' });
    }
});

// PUT
router.put('/:table/:id', async (req, res) => {
    try {
        await logic.updateItem(req.params.table, req.params.id, req.body);
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update' });
    }
});

// DELETE
router.delete('/:table/:id', async (req, res) => {
    try {
        await logic.deleteItem(req.params.table, req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;
