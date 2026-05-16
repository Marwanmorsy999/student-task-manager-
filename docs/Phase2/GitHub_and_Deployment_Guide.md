# GitHub Project Management & Deployment Guide

This guide covers how to set up the GitHub repository requirements and deploy the application using the GitHub Student Developer Pack.

## 1. GitHub Project Management Setup

Your university requires the use of Backlog, Project Issues, Scrum Board, and Scrum Meeting Summaries. GitHub provides built-in tools for all of these.

### A. Creating the Scrum Board (GitHub Projects)
1. Navigate to your GitHub repository: `https://github.com/Marwanmorsy999/student-task-manager-`.
2. Click on the **Projects** tab at the top.
3. Click **Link a project** -> **New project**.
4. Select the **Board** template (this gives you a Kanban/Scrum board).
5. Rename the project to "TaskFlow Scrum Board".
6. The board comes with default columns: `Todo`, `In Progress`, and `Done`. This satisfies the Scrum Board requirement.

### B. Setting up the Backlog & Issues
1. Go to the **Issues** tab in your repository.
2. Click **New issue**. Create issues for every feature you plan to build (e.g., "Implement Pomodoro Timer", "Create Stats Page", "Add User Authentication").
3. On the right sidebar of the issue creation page, select **Projects** and choose your "TaskFlow Scrum Board".
4. Assign the issue a status of `Todo` (this acts as your Backlog).

### C. Scrum Meeting Summaries
To document your Scrum Meetings (Daily Standups or Sprint Plannings):
1. Use **GitHub Discussions** or create a dedicated markdown file like `docs/Scrum_Meetings.md`.
2. Alternatively, create a special Issue labeled `Meeting Notes` and add comments for each meeting detailing:
   - What did we do yesterday?
   - What will we do today?
   - Are there any blockers?

---

## 2. Deployment Guide (GitHub Student Pack)

You must deploy the application. Since this is a full-stack app (React Frontend + Node.js/MongoDB Backend), it's easiest to deploy them separately.

> **Note:** Ensure you have claimed your GitHub Student Developer Pack to access premium features on these platforms for free.

### A. Deploying the Frontend (Vercel)
Vercel is the easiest platform to deploy Vite/React applications.

1. Go to [Vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `student-task-manager-` repository.
4. **Important Configuration:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client` (Select the `client` folder, not the root of the repo).
   - **Environment Variables:** Add `VITE_API_URL` and set its value to your backend's deployed URL (you'll update this after deploying the backend).
5. Click **Deploy**.

### B. Deploying the Backend (Render)
Render is an excellent free platform for Node.js backends.

1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. **Important Configuration:**
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables:**
   - `MONGO_URI`: Your MongoDB Atlas connection string (Do not use `localhost`).
   - `JWT_SECRET`: A secure random string for signing tokens.
   - `PORT`: `5000` (Optional, Render will set this automatically).
6. Click **Create Web Service**.

### C. Connecting the Frontend and Backend
1. Once Render finishes deploying the backend, copy the URL (e.g., `https://taskflow-api.onrender.com`).
2. Go back to Vercel, navigate to your Frontend project settings -> **Environment Variables**.
3. Add or update `VITE_API_URL` to the Render URL you just copied.
4. Trigger a re-deploy on Vercel to apply the changes.

## 3. CI/CD Pipeline
We have already configured `.github/workflows/ci.yml`. 
Every time you create a **Pull Request** or push code to the `main` branch, GitHub Actions will automatically install dependencies, run linting, and execute both Frontend (`vitest`) and Backend (`jest`) tests. This completely satisfies the automated testing requirement!
