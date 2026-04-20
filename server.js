const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Database('tasks.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Create tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    due       TEXT NOT NULL,
    priority  TEXT NOT NULL,
    done      INTEGER DEFAULT 0
  )
`);

// ── API ROUTES ────────────────────────────────────────────────────────────

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

// POST add a new task
app.post('/api/tasks', (req, res) => {
  const { title, due, priority } = req.body;
  if (!title || !due || !priority) {
    return res.status(400).json({ error: 'Title, due date and priority are required' });
  }
  const result = db.prepare(
    'INSERT INTO tasks (title, due, priority) VALUES (?, ?, ?)'
  ).run(title, due, priority);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PATCH toggle done/undone
app.patch('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('UPDATE tasks SET done = ? WHERE id = ?').run(task.done ? 0 : 1, req.params.id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
