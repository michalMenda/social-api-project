const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'access-secret';

// מחלץ את ה־IP האמיתי גם אם יש פרוקסי (כמו nginx או Heroku)
function getRequestIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0]; // אם יש שרשרת IP-ים, קח את הראשון
    }
    return req.ip;
}

function verifyToken(req, res, next) {
    const path = ['/login', '/register', '/refresh','/logout']; // נתיבים שאינם מוגנים
    if(path.includes(req.path)) {
        return next(); // אם זה לא אחד מהנתיבים המוגנים, המשך
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const requestIp = getRequestIp(req);
        if (payload.ip !== requestIp) {
            return res.status(403).json({ error: 'IP mismatch' });
        }

        req.user = payload; // נשמר למקרה שתצטרך להשתמש במזהה המשתמש
        next();
    });
}

module.exports = verifyToken;
