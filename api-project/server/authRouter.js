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
        const { username, password, ...rest } = req.body;

        // בדיקה אם המשתמש כבר קיים
        const existing = await bl.getAllItems('users', { name: username });
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUserId = await bl.createItem('users', {
            name: username,
            website: password,  // כן, כן – עדיין משתמשים ב־website כשדה סיסמה לפי הדאטה שלך
            ...rest
        });

        res.status(201).json({ id: newUserId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
