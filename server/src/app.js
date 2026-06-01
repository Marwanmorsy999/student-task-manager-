const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['https://student-task-manager-git-main-marwan-morsy-s-projects.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;





// Allow CORS from your Vercel frontend
app.use(cors({
  origin: ['https://student-task-manager-git-main-marwan-morsy-s-projects.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// ... rest of your code