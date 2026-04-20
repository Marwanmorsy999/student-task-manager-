# Student Task Manager

A full-stack web app for managing student tasks.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **API**: REST API

## Project Structure
```
student-task-manager/
├── frontend/
│   └── index.html        # The UI
├── backend/
│   └── server.js         # Node.js server + API routes
├── package.json          # Dependencies
├── .gitignore
└── README.md
```

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Add a new task |
| PATCH | /api/tasks/:id | Toggle task done/undone |
| DELETE | /api/tasks/:id | Delete a task |

## How to Run
### 1. Install Node.js
Download from: https://nodejs.org (choose LTS version)

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm start
```

### 4. Open the app
Go to: http://localhost:3000

## Team Work Split
| Person | Feature | Branch |
|--------|---------|--------|
| Person 1 | Navbar + homepage | feature/homepage |
| Person 2 | Add task form | feature/add-task |
| Person 3 | Task list display | feature/task-list |
| Person 4 | Delete + API logic | feature/delete-task |
| Person 5 | Styling & CSS | feature/styling |
| Person 6 | Search & filter | feature/search-filter |
