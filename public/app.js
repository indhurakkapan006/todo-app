const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // if you serve frontend files from /public

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'todo_user',        // use the dedicated user you created
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
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  const query = 'INSERT INTO tasks (text, completed) VALUES (?, ?)';
  db.query(query, [text, false], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).send('Server error');
    } else {
      res.status(201).json({ id: result.insertId, text, completed: false });
    }
  });
});

// Toggle task completion
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;
  const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(query, [completed, taskId], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Task updated');
    }
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [taskId], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Task deleted');
    }
  });
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});