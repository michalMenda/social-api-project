const express = require('express');
const router = express.Router();
const bl = require('./BL/logic');

// התחברות
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await bl.loginUser(email, password);
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// הרשמה
router.post('/register', async (req, res) => {
    try {
        const { name, email, address, phone, password } = req.body;
        const existing = await bl.getAllItems('users', { name });
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const createdUser = await bl.registerUser({ name, email, address, phone, password });

        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
