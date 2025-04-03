# Time Tracker

A modern and lightweight time tracking system for small teams and internal use. It allows employees to log their working hours (check-in/check-out), while administrators can view and edit all user entries through a secure, role-based dashboard.

---

## Overview 

Time Tracker is a full-stack application designed to simplify employee attendance management. It features token-based authentication using cookies, secure route protection, and a clean UI built with React, TypeScript, and Tailwind CSS.

Users log in to access a personal dashboard showing their daily records and real-time clock. Admins get access to a full overview of user entries with editing capabilities.

---

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS
- ShadCN UI
- React Router
- Axios

**Backend**
- Node.js + Express
- JSON Web Tokens (JWT)
- Cookie-based authentication
- Bcrypt for password hashing
- File-based storage using JSON

---

## User Roles

- **Employee**: Can log in, check in/out, and view their own timesheet.
- **Admin**: Has full access to all timesheets and can modify user entries.

---

## Authentication and Authorization

- Users authenticate via auth route, which returns an **HTTP-only cookie** containing a JWT.
- The cookie is sent automatically with each request, providing secure and persistent authentication.
- Backend middleware validates tokens and enforces role-based access:
  - Protected routes check if the user is logged in.
  - Admin-only routes verify the `admin` role.

---

## Installation and Setup

```bash
# Clone the project
git clone https://github.com/your-username/time-tracker-system.git
cd time-tracker-system

# Setup backend
cd server
npm install
npm start

# Setup frontend
cd ../client
npm install
npm run dev
```