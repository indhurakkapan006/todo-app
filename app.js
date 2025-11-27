const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve frontend files

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'todo_user',        // replace with your MySQL user
  password: 'securepass123', // replace with your password
  database: 'todo_app'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// ------------------ ROUTES ------------------

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send('Server error');
    res.json(results);
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  db.query('INSERT INTO tasks (text, completed) VALUES (?, ?)', [text, false], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.status(201).json({ id: result.insertId, text, completed: false });
  });
});

// Toggle task completion
app.put('/api/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, req.params.id], err => {
    if (err) return res.status(500).send('Server error');
    res.send('Task updated');
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Server error');
    res.send('Task deleted');
  });
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});