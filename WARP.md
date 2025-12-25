# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository contains the functional specification and a working implementation for **ApplySmart – Skill Gap Job Portal MVP**, a phase-1 job search and application website intended for a college project demo. The core differentiator is the **Skill Gap Visualizer**, which compares a job seeker's skills against a job's required skills and surfaces matched vs missing skills along with a match percentage and progress bar.

The repo is structured as a local full-stack app with `server/` (Node.js + Express + SQLite) and `client/` (React + Vite + Tailwind CSS).

## Tech stack

Implemented stack:
- Frontend: React (Vite) in `client/`
- Styling: Tailwind CSS
- Backend: Node.js + Express in `server/`
- Database: SQLite (via `sqlite3`)
- Authentication: JWT in HTTP-only cookies
- File uploads: Resume upload (PDF only) stored under `server/uploads/`

## Intended application architecture

These notes describe the planned architecture from `README.md`. They are expectations, not a guarantee of the current file structure.

### Core domains

- **Users**
  - Roles: `Job Seeker` and `Employer`, chosen at signup.
  - Job seekers have: name, skills (comma-separated text), resume (PDF).
  - Employers have: company name and description.
- **Jobs**
  - Created by employers with title, description, required skills (comma-separated), and location.
  - Displayed as cards in search results with title, company, location, and required skills.
- **Applications**
  - Link users to jobs, with one application per user/job pair.
  - Store: job ID, user ID, resume reference, applied date.

### Skill Gap Visualizer

For each job detail page, the backend or frontend should:
- Compare required skills for the job with the job seeker's skills.
- Derive:
  - Matched skills (shown as green badges).
  - Missing skills (shown as red badges).
  - Match percentage = matched_required_skills / total_required_skills * 100.
  - A progress bar reflecting the match percentage.

The UI should expose this clearly on the job details page so it is an obvious, standout feature during demos.

### High-level page structure

The planned pages are:
- Landing page
- Login / Signup
- Job search page
- Job details page (includes Skill Gap Visualizer and Apply action)
- Job seeker dashboard (lists applied jobs with titles, company, applied date)
- Employer dashboard (manage posted jobs and view applicants)

On the backend (in `server/src`), the main areas are:
- `index.js`: Express app bootstrap (CORS, JSON, cookies, static `/uploads`, routes under `/api/*`).
- `db.js`: SQLite connection, schema initialization, and small `run/get/all` helpers.
- `auth.js`: JWT helpers and `requireAuth` / `requireRole` middleware using an `auth_token` HTTP-only cookie.
- `routes/auth.js`: Signup, login, logout, and `me` endpoints.
- `routes/profile.js`: Profile update and resume upload (`multipart/form-data`) for PDFs.
- `routes/jobs.js`: Job listing, search, details, creation, and employer job listing.
- `routes/applications.js`: Apply to job, job seeker applications list, and employer job applicants.

### Data model (minimum tables)

Planned minimum database tables (from `README.md`):
- `Users`
- `Jobs`
- `Applications`

Future agents should confirm actual table/ORM definitions and keep this section in sync with the implemented schema.

## Commands and workflows

### Backend (server)
- Location: `server/`
- Dev server (local):
  - `cd server`
  - `npm run dev` (starts Express on `http://localhost:4000`)
- Production-style run:
  - `cd server`
  - `npm start`

The Express app exposes JSON APIs under `/api/*` and serves uploaded resumes from `/uploads/*`.

### Frontend (client)
- Location: `client/`
- Dev server:
  - `cd client`
  - `npm run dev` (Vite on `http://localhost:5173`)
- Build for production:
  - `cd client`
  - `npm run build`
- Preview built app:
  - `cd client`
  - `npm run preview`

The frontend uses `VITE_API_BASE_URL` (defaulting to `http://localhost:4000/api`) and sends credentials with each request so that JWT cookies work.

### High-level frontend structure
- `client/src/main.jsx`: React entrypoint with `BrowserRouter` and `AuthProvider`.
- `client/src/App.jsx`: Top-level routes and `RequireAuth` wrapper for protected pages.
- `client/src/context/AuthContext.jsx`: Handles `/api/auth/*` calls and stores the current user.
- `client/src/api.js`: Small wrapper for calling backend APIs with `fetch`.
- `client/src/components/Navbar.jsx`: Navigation bar that adapts to auth state and role.
- `client/src/components/SkillGapVisualizer.jsx`: Implements the skill comparison logic and progress bar UI.
- `client/src/pages/*`: Page-level components for Landing, Login, Signup, Job search, Job details, Job seeker dashboard, and Employer dashboard.

### Notes for future agents
- There is currently no automated test suite configured; if you add one (e.g., Vitest/Jest), document how to run single tests here.
- If you change the auth mechanism (e.g., sessions instead of JWT), update both the backend `auth.js` and the frontend `AuthContext` expectations.

## Non-goals (phase 1)

Per `README.md`, phase 1 explicitly excludes:
- Admin panel
- AI / ML
- Payments
- Email notifications
- Recommendations

Future work that introduces these capabilities should update this section and the architecture notes accordingly.
