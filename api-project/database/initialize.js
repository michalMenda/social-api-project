// database/initialize.js
const mysql = require('../server/DAL/connection');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function ensureColumnExists(table, column, definition) {
  const [rows] = await mysql.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (rows[0].cnt === 0) {
    await mysql.query(
      `ALTER TABLE \`${table}\`
       ADD COLUMN ${column} ${definition}`
    );
    console.log(`🆕 Added ${column} to ${table}`);
  } else {
    console.log(`✅ ${table}.${column} already exists`);
  }
}

async function initializeDatabase() {
  try {
    console.log('🔧 Creating tables (if not exists)…');

    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255),
        address VARCHAR(255),
        phone VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(255),
        body TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT,
        body TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        email VARCHAR(255),
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

    console.log('🔧 Ensuring required columns exist…');

    for (const tbl of ['users', 'todos', 'posts', 'comments', 'passwords']) {
      await ensureColumnExists(tbl, 'is_active', 'BOOLEAN DEFAULT TRUE');
    }

    await ensureColumnExists('comments', 'email', 'VARCHAR(255)');

    console.log('🔧 Dropping old triggers…');
    await mysql.query(`DROP TRIGGER IF EXISTS deactivate_user_todos`);
    await mysql.query(`DROP TRIGGER IF EXISTS deactivate_post_comments`);

    console.log('🔧 Creating triggers…');
    await mysql.query(`
      CREATE TRIGGER deactivate_user_todos
      AFTER UPDATE ON users
      FOR EACH ROW
      BEGIN
        IF OLD.is_active != NEW.is_active AND NEW.is_active = FALSE THEN
          UPDATE todos SET is_active = FALSE WHERE user_id = NEW.id;
        END IF;
      END
    `);
    await mysql.query(`
      CREATE TRIGGER deactivate_post_comments
      AFTER UPDATE ON posts
      FOR EACH ROW
      BEGIN
        IF OLD.is_active != NEW.is_active AND NEW.is_active = FALSE THEN
          UPDATE comments SET is_active = FALSE WHERE post_id = NEW.id;
        END IF;
      END
    `);

    console.log('🔧 Inserting initial data…');
    const dataPath = path.join(__dirname, 'initialData.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    for (const u of jsonData.users) {
      await mysql.execute(
        `INSERT INTO users (id, name, email, address, phone, is_active)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [u.id, u.name, u.email, u.address, u.phone, true]
      );
    }

    for (const t of jsonData.todos) {
      await mysql.execute(
        `INSERT INTO todos (id, user_id, title, is_active)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [t.id, t.user_id, t.title, true]
      );
    }

    for (const p of jsonData.posts) {
      await mysql.execute(
        `INSERT INTO posts (id, user_id, title, body, is_active)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [p.id, p.user_id, p.title, p.body, true]
      );
    }

    for (const c of jsonData.comments) {
      await mysql.execute(
        `INSERT INTO comments (id, post_id, body, email, is_active)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [c.id, c.post_id, c.body, c.email, true]
      );
    }

    for (const pw of jsonData.passwords) {
      const hash = await bcrypt.hash(pw.password, 10);
      await mysql.execute(
        `INSERT INTO passwords (user_id, password_hash)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE user_id = user_id`,
        [pw.user_id, hash]
      );
    }

    console.log('✅ Database initialized successfully!');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    await mysql.end();
  }
}

initializeDatabase();
