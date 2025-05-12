const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true              
}));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true); 
const authRouter = require('./authRouter');
const createRouter = require('./routes');
const varifyToken= require('./auth');

app.use(varifyToken);
app.use('/users', createRouter('users'));
app.use('/posts', createRouter('posts'));
app.use('/comments', createRouter('comments'));
app.use('/todos', createRouter('todos'));
app.use('/', authRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
