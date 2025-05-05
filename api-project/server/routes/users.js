const express = require('express');
const router = express.Router();
const bl = require('../BL/logic');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await bl.getAllItems('users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await bl.getItemById('users', req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE user
router.post('/', async (req, res) => {
    try {
        const newUserId = await bl.createItem('users', req.body);
        res.status(201).json({ id: newUserId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE user
router.put('/:id', async (req, res) => {
    try {
        await bl.updateItem('users', req.params.id, req.body);
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        await bl.deleteItem('users', req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
