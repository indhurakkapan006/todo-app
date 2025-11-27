const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'todo_user',       // use the new user
  password: 'securepass123',
  database: 'todo_app'
});

db.connect(err => {
  if (err) {
    console.error('DB Error:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});


// --- API ROUTES ---

// 1. GET all tasks
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. ADD a new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    db.query('INSERT INTO tasks (text) VALUES (?)', [text], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, text, completed: 0 });
    });
});

// 3. TOGGLE task completion (Update)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    // This SQL flips the 'completed' status (0 -> 1, 1 -> 0)
    db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Task updated' });
    });
});

// 4. DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Task deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});