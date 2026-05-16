# System Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the software requirements for the "Student Task Manager" (TaskFlow) application. It provides a complete description of the system's behavior, including functional and non-functional requirements.

### 1.2 Scope
TaskFlow is a comprehensive full-stack web application built specifically for students. It enables users to register, log in securely, create and manage academic tasks, track their study habits via a Pomodoro timer, and view productivity analytics.

### 1.3 Technologies Used
- **Frontend:** React, Vite, Tailwind CSS, FullCalendar, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## 2. Overall Description

### 2.1 User Characteristics
The primary users of this system are students who need an organized way to manage assignments, exams, and study schedules. Users are expected to have basic computer literacy and internet access.

### 2.2 Assumptions and Dependencies
- The user has an active internet connection.
- The user is utilizing a modern web browser (Chrome, Firefox, Safari, Edge).
- The system depends on MongoDB for data persistence.

---

## 3. Functional Requirements

Functional Requirements (FRs) define what the system must do.

- **FR-01 (User Authentication):**
  - The system shall allow users to register an account using their name, email, and a secure password.
  - The system shall authenticate users via JWT upon login.
  - The system shall allow users to log out safely.

- **FR-02 (Task Management):**
  - The system shall allow authenticated users to create new tasks with a title, description, due date, status, priority, and category.
  - The system shall allow users to view a list of all their tasks.
  - The system shall allow users to edit existing task details.
  - The system shall allow users to delete tasks.

- **FR-03 (Calendar View):**
  - The system shall provide a calendar interface displaying tasks based on their due dates.
  - Users shall be able to click on calendar events to view task details.

- **FR-04 (Productivity Timer - Pomodoro):**
  - The system shall include a focus timer that defaults to standard Pomodoro intervals (e.g., 25 minutes focus, 5 minutes break).
  - The user shall be able to start, pause, and reset the timer.

- **FR-05 (Productivity Analytics / Stats):**
  - The system shall generate graphical statistics based on task completion.
  - The system shall display charts detailing task status distribution, priority breakdown, and productivity trends over time.

---

## 4. Non-Functional Requirements

Non-Functional Requirements (NFRs) define system attributes such as performance, security, and usability.

- **NFR-01 (Security):**
  - All user passwords must be hashed using `bcrypt` before storage in the database.
  - API endpoints requiring authorization must be protected via JWT validation middleware.

- **NFR-02 (Performance):**
  - The application UI should respond to user interactions within 500 milliseconds under normal load.
  - Database queries should be optimized using appropriate indexing.

- **NFR-03 (Usability):**
  - The user interface must be fully responsive, functioning correctly on desktop, tablet, and mobile devices.
  - The application must provide clear error messages and validation feedback to the user.

- **NFR-04 (Availability & Reliability):**
  - The system should maintain an uptime of 99% during typical academic semesters.
  - The database should have automated backups configured (handled via MongoDB Atlas or specific cloud provider).

- **NFR-05 (Maintainability):**
  - The codebase must be well-structured following MVC (Model-View-Controller) architecture on the backend.
  - The system must include automated testing (Unit and Integration tests) and a CI/CD pipeline.
