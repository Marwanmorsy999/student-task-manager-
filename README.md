# ✦ TaskFlow — Student Task Manager

![CI](https://github.com/your-org/taskflow/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)

> A full-stack task management application built for students — clean UI, JWT auth, dark mode, and a proper engineering workflow.

---

## 📸 Preview

| Dashboard (Light) | Tasks (Dark) |
|---|---|
| ![dashboard](.github/screenshots/dashboard-light.png) | ![tasks](.github/screenshots/tasks-dark.png) |

---

## ✨ Features

- 🔐 **JWT Authentication** — register, login, protected routes
- ✅ **Task Management** — create, edit, delete, mark done
- 🔍 **Search & Filter** — by title, priority, and status
- 📊 **Dashboard Stats** — completion rate, overdue count, priority breakdown
- 🌙 **Dark Mode** — persisted across sessions
- 📱 **Responsive** — works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/your-org/taskflow.git
cd taskflow
```

### 2. Set up environment variables
```bash
cp .env.example server/.env
# Edit server/.env and fill in MONGO_URI and JWT_SECRET

cp .env.example client/.env
# Edit client/.env — set VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies
```bash
npm run install:all
```

### 4. Run in development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 📁 Project Structure

```
taskflow/
├── client/                    # React + Vite + Tailwind
│   └── src/
│       ├── api/               # Axios instance + API helpers
│       ├── components/
│       │   ├── ui/            # Button, Input, Badge, Modal
│       │   ├── layout/        # Navbar
│       │   └── tasks/         # TaskCard, TaskForm, FilterBar
│       ├── context/           # AuthContext, ThemeContext
│       ├── hooks/             # useTasks
│       ├── pages/             # Login, Register, Dashboard, Tasks
│       └── utils/             # Date & priority helpers
│
├── server/                    # Express + MongoDB
│   └── src/
│       ├── controllers/       # authController, taskController
│       ├── middleware/        # JWT auth, error handler
│       ├── models/            # User, Task (Mongoose)
│       ├── routes/            # auth.routes, task.routes
│       └── config/            # MongoDB connection
│
└── .github/
    ├── workflows/ci.yml       # GitHub Actions
    ├── ISSUE_TEMPLATE/        # Bug & feature templates
    └── pull_request_template.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Sign in | — |
| GET | `/api/auth/me` | Get current user | ✅ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks (filterable) | ✅ |
| GET | `/api/tasks/stats` | Get dashboard stats | ✅ |
| POST | `/api/tasks` | Create a task | ✅ |
| PUT | `/api/tasks/:id` | Update a task | ✅ |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ |

**Query params for GET /api/tasks:** `?status=pending&priority=high&search=math&sort=-createdAt`

---

## 🧪 Running Tests

```bash
# Server tests
cd server && npm test

# With coverage
cd server && npm test -- --coverage
```

---

## 🌿 Git Workflow

```
main          ← stable, production-ready
develop       ← integration branch
feature/*     ← individual features (merged into develop via PR)
```

### Branch naming
```
feature/auth-jwt
feature/task-crud
feature/dashboard-stats
feature/ui-darkmode
fix/task-filter-bug
```

---

## 👥 Team

| Member | Role | Branch |
|--------|------|--------|
| P1 | Auth Backend | `feature/auth-jwt` |
| P2 | Dashboard & UI | `feature/dashboard` |
| P3 | Tasks Frontend | `feature/task-frontend` |
| P4 | UI Polish & Dark Mode | `feature/ui-polish` |
| P5 | Tasks Backend | `feature/task-api` |
| P6 | DevOps & CI/CD | `feature/devops` |

---

## 📦 Deployment

### Deploy to Render (recommended — free)

**Backend:**
1. New Web Service → connect your GitHub repo
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`

**Frontend:**
1. New Static Site → connect your GitHub repo
2. Root directory: `client`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 📄 License

MIT © 2025 TaskFlow Team
