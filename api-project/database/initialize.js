// database/initialize.js
const mysql   = require('../server/config/connection');
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcrypt');

async function ensureIsActive(table) {
  // 1. בדיקה אם העמודה כבר קיימת
  const [rows] = await mysql.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = 'isActive'`,
    [table]
  );
  if (rows[0].cnt === 0) {
    // 2. אם לא קיימת – מוסיפים
    await mysql.query(
      `ALTER TABLE \`${table}\`
       ADD COLUMN isActive BOOLEAN DEFAULT TRUE`
    );
    console.log(`🆕 Added isActive to ${table}`);
  } else {
    console.log(`✅ ${table}.isActive already exists`);
  }
}

async function initializeDatabase() {
  try {
    console.log('🔧 Creating tables (if not exists)…');

    // 1. יצירת הטבלאות (עם isActive – נוסף מעכשיו)
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        address VARCHAR(255),
        phone VARCHAR(50),
        password_hash VARCHAR(255),
        isActive BOOLEAN DEFAULT TRUE
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        isActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        body TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await mysql.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY,
        post_id INT,
        body TEXT,
        isActive BOOLEAN DEFAULT TRUE,
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

    console.log('🔧 Ensuring isActive column exists…');
    // 2. הוספת isActive לכל טבלה אם חסרה
    for (const tbl of ['users', 'todos', 'posts', 'comments', 'passwords']) {
      await ensureIsActive(tbl);
    }

    console.log('🔧 Dropping old triggers…');
    // 3. מחיקת טריגרים ישנים (אם היו)
    await mysql.query(`DROP TRIGGER IF EXISTS deactivate_user_todos`);
    await mysql.query(`DROP TRIGGER IF EXISTS deactivate_post_comments`);

    console.log('🔧 Creating triggers…');
    // 4. יצירת טריגרים חדשים
    await mysql.query(`
      CREATE TRIGGER deactivate_user_todos
      AFTER UPDATE ON users
      FOR EACH ROW
      BEGIN
        IF OLD.isActive != NEW.isActive AND NEW.isActive = FALSE THEN
          UPDATE todos SET isActive = FALSE WHERE user_id = NEW.id;
        END IF;
      END
    `);

    await mysql.query(`
      CREATE TRIGGER deactivate_post_comments
      AFTER UPDATE ON posts
      FOR EACH ROW
      BEGIN
        IF OLD.isActive != NEW.isActive AND NEW.isActive = FALSE THEN
          UPDATE comments SET isActive = FALSE WHERE post_id = NEW.id;
        END IF;
      END
    `);

    console.log('🔧 Inserting initial data…');
    // 5. טעינת JSON והכנסה בטבלאות
    const dataPath = path.join(__dirname, 'initialData.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // משתמשים
    for (const u of jsonData.users) {
      const hash = await bcrypt.hash(u.password || '', 10);
      await mysql.execute(
        `INSERT INTO users (id, name, email, address, phone, password_hash, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [u.id, u.name, u.email, u.address, u.phone, hash, true]
      );
    }
    // todos
    for (const t of jsonData.todos) {
      await mysql.execute(
        `INSERT INTO todos (id, user_id, title, isActive)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [t.id, t.user_id, t.title, true]
      );
    }
    // posts
    for (const p of jsonData.posts) {
      await mysql.execute(
        `INSERT INTO posts (id, user_id, title, body, isActive)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [p.id, p.user_id, p.title, p.body, true]
      );
    }
    // comments
    for (const c of jsonData.comments) {
      await mysql.execute(
        `INSERT INTO comments (id, post_id, body, isActive)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [c.id, c.post_id, c.body, true]
      );
    }
    // passwords
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
