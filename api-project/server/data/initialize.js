const mysql = require('../config/connection');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
    try {
        console.log('🔧 Creating tables...');

        await mysql.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                address VARCHAR(255),
                phone VARCHAR(50)
            )
        `);

        await mysql.execute(`
            CREATE TABLE IF NOT EXISTS todos (
                id INT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await mysql.execute(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255),
                body TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await mysql.execute(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT PRIMARY KEY,
                post_id INT,
                body TEXT,
                FOREIGN KEY (post_id) REFERENCES posts(id)
            )
        `);

        await mysql.execute(`
            CREATE TABLE IF NOT EXISTS passwords (
                user_id INT PRIMARY KEY,
                password_hash VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log('✅ Tables created.');

        // Load data from JSON
        const dataPath = path.join(__dirname, 'initialData.json');
        const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        console.log('🚀 Inserting users...');
        for (const user of jsonData.users) {
            await mysql.execute(
                `INSERT INTO users (id, name, email, address, phone) VALUES (?, ?, ?, ?, ?)`,
                [user.id, user.name, user.email, user.address, user.phone]
            );
        }

        console.log('🚀 Inserting todos...');
        for (const todo of jsonData.todos) {
            await mysql.execute(
                `INSERT INTO todos (id, user_id, title) VALUES (?, ?, ?)`,
                [todo.id, todo.user_id, todo.title]
            );
        }

        console.log('🚀 Inserting posts...');
        for (const post of jsonData.posts) {
            await mysql.execute(
                `INSERT INTO posts (id, user_id, title, body) VALUES (?, ?, ?, ?)`,
                [post.id, post.user_id, post.title, post.body]
            );
        }

        console.log('🚀 Inserting comments...');
        for (const comment of jsonData.comments) {
            await mysql.execute(
                `INSERT INTO comments (id, post_id, body) VALUES (?, ?, ?)`,
                [comment.id, comment.post_id, comment.body]
            );
        }

        console.log('🚀 Inserting passwords...');
        for (const passwordEntry of jsonData.passwords) {
            const hashedPassword = await bcrypt.hash(passwordEntry.password, 10);
            await mysql.execute(
                `INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)`,
                [passwordEntry.user_id, hashedPassword]
            );
        }

        console.log('✅ Data inserted successfully!');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    } finally {
        mysql.end();
    }
}

initializeDatabase();
