const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('tasks.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Create tasks table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      due TEXT NOT NULL,
      priority TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);
});

// ── API ROUTES ─────────────────────────────────────────

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add a new task
app.post('/api/tasks', (req, res) => {
  const { title, due, priority } = req.body;

  if (!title || !due || !priority) {
    return res.status(400).json({
      error: 'Title, due date and priority are required'
    });
  }

  const sql = `INSERT INTO tasks (title, due, priority) VALUES (?, ?, ?)`;

  db.run(sql, [title, due, priority], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get(
      'SELECT * FROM tasks WHERE id = ?',
      [this.lastID],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      }
    );
  });
});

// PATCH toggle done/undone
app.patch('/api/tasks/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newDone = task.done ? 0 : 1;

    db.run(
      'UPDATE tasks SET done = ? WHERE id = ?',
      [newDone, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, updated) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(updated);
        });
      }
    );
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Task deleted' });
    });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});