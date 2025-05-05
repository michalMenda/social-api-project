const express = require('express');
const router = express.Router({ mergeParams: true });
const bl = require('../BL/logic');

// GET all todos for a user
router.get('/', async (req, res) => {
    try {
        const todos = await bl.getAllItems('todos');
        res.json(todos.filter(t => t.user_id == req.params.id));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET todo by ID
router.get('/:todoId', async (req, res) => {
    try {
        const todo = await bl.getItemById('todos', req.params.todoId);
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE todo for a user
router.post('/', async (req, res) => {
    try {
        const todoData = { ...req.body, user_id: req.params.id };
        const newTodoId = await bl.createItem('todos', todoData);
        res.status(201).json({ id: newTodoId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE todo
router.put('/:todoId', async (req, res) => {
    try {
        await bl.updateItem('todos', req.params.todoId, req.body);
        res.json({ message: 'Todo updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE todo
router.delete('/:todoId', async (req, res) => {
    try {
        await bl.deleteItem('todos', req.params.todoId);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
