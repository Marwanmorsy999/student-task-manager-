# ✦ TaskFlow — Student Task Manager

![CI](https://github.com/Marwanmorsy999/student-task-manager-/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)

> A polished student task manager built with React, Node.js, Express, MongoDB and JWT authentication.

---

## ✨ Project highlights

- 🔐 **JWT authentication** with protected routes
- ✅ **Task CRUD** with status, priority, and due date support
- 📊 **Dashboard statistics** for progress tracking
- 🌙 **Dark mode** and responsive UI
- ⚡ **Fast development setup** using Vite and Express
- 🧪 **Server tests** with Jest and Supertest

---

## 🛠 Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs |
| Testing | Jest, Supertest |
| CI/CD | GitHub Actions |

---

## 🚀 Getting started

### Prerequisites
- Node.js ≥ 18
- MongoDB connection string

### 1. Clone the repository
```bash
git clone https://github.com/Marwanmorsy999/student-task-manager-.git
cd taskflow
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables
Copy the example files and update the variables.

```bash
copy .env.example server\.env
copy .env.example client\.env
```

Update `server/.env` with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Update `client/.env` with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start development servers
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 📁 Repository structure

```
taskflow/
├── client/                    # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/               # Axios helpers
│   │   ├── components/        # UI components and task features
│   │   ├── context/           # Auth and theme providers
│   │   ├── hooks/             # custom hooks
│   │   ├── pages/             # app pages
│   │   └── utils/             # helper functions
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # database connection
│   │   ├── controllers/       # request handlers
│   │   ├── middleware/        # auth and error handling
│   │   ├── models/            # Mongoose schemas
│   │   └── routes/            # API routes
│   ├── package.json
│   └── server.js
├── .github/                   # GitHub workflows and templates
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

---

## 🔌 API reference

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Task management
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | List tasks | Yes |
| GET | `/api/tasks/stats` | Dashboard stats | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

**Filter and sort query params:** `status`, `priority`, `search`, `sort`

---

## 🧪 Tests

Run server tests:
```bash
cd server && npm test
```

---

## 📦 NPM scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend and backend together |
| `npm run build` | Build frontend production bundle |
| `npm run start` | Start backend server only |
| `npm run install:all` | Install dependencies for root, client, and server |
| `npm run test` | Run backend tests |

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a PR with your feature or bug fix.

For details, see `CONTRIBUTING.md`.

---

## 📄 License

MIT © 2025 TaskFlow Team
