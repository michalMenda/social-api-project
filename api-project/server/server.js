const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ROUTES
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const todosRoutes = require('./routes/todos');

app.use('/users', usersRoutes);
app.use('/users/:id/posts', postsRoutes);
app.use('/users/:id/todos', todosRoutes);

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
console.log('🔧 Loading initial data...');