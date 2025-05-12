const express = require('express');
const router = express.Router();
const bl = require('../BL/logic');
const jwt = require('jsonwebtoken');

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret';
// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await bl.loginUser(email, password);
        const ip = req.ip;
        bl.sendAuthTokens(res, user, ip);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// register
router.post('/register', async (req, res) => {
    try {
        const { name, email, address, phone, password } = req.body;
        const existing = await bl.getItems('users', { name });
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const createdUser = await bl.registerUser({ name, email, address, phone, password });
        const ip = req.ip;
        bl.sendAuthTokens(res, createdUser, ip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, REFRESH_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);

        const ip = req.ip;
        if (payload.ip !== ip) {
            return res.status(403).json({ error: 'IP mismatch' });
        }

        const newAccessToken = jwt.sign(
            { id: payload.id, email: payload.email, ip: payload.ip },
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
});
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.json({ message: 'Logged out successfully' });
});


module.exports = router;
