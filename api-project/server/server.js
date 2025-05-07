const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const createRouter = require('./routes');

app.use('/users', createRouter('users'));
app.use('/posts', createRouter('posts'));
app.use('/comments', createRouter('comments'));
app.use('/todos', createRouter('todos'));

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
