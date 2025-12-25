# ApplySmart – Skill Gap Job Portal MVP

A Phase-1 MVP job search and application website intended for a college project demo. ApplySmart focuses on tech roles and highlights a unique feature called the **Skill Gap Visualizer**, which compares a job seeker&apos;s skills against each job&apos;s required skills.

## Tech Stack
- **Frontend:** React
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (or Replit DB)
- **Authentication:** Session-based or JWT
- **File Uploads:** Resume upload (PDF only)

## User Roles
- **Job Seeker**
- **Employer**

Role is selected during signup.

## Core Features

### Authentication
- Signup with: Name, Email, Password, Role (Job Seeker / Employer)
- Login / Logout
- Protected routes based on role

### Job Seeker
- **Profile:** Name, Skills (comma-separated text), Resume upload (PDF)
- **Job Search:**
  - View all jobs
  - Search by job title and skills
  - Job cards show: job title, company name, location, required skills
- **Job Details Page:**
  - Full job description
  - Required skills
  - **Skill Gap Visualizer** (see below)
- **Apply to Job:**
  - Apply once per job
  - Application stores: Job ID, User ID, Resume, Applied date
  - Prevent duplicate applications
- **Job Seeker Dashboard:**
  - List applied jobs with job title, company, applied date

### Employer
- **Employer Profile:** Company name, description
- **Job Posting:**
  - Create job with job title, description, required skills (comma-separated), location
  - View list of jobs posted
- **Applicant Viewing:**
  - For each job, list applicants
  - View applicant name + resume

## Skill Gap Visualizer (Key Feature)
For each job, compare **Job Required Skills** vs **User Skills** and show:
- ✅ Matched skills (green badges)
- ❌ Missing skills (red badges)
- **Match Percentage** = (matched_skills / total_required_skills) * 100
- A progress bar reflecting match percentage

This feature is clearly visible on the job details page.

## Pages
- Landing page
- Login / Signup
- Job search page
- Job details page
- Job seeker dashboard
- Employer dashboard

## Database (Minimum Tables)
- **Users**
- **Jobs**
- **Applications**

## Non-Goals (Not in Phase 1)
- No admin panel
- No AI / ML
- No payments
- No email notifications
- No recommendations

## Running the Project (Local)

This repo contains a working full-stack MVP with:
- `server/` – Node.js + Express API with SQLite
- `client/` – React + Vite + Tailwind CSS frontend

### Prerequisites
- Node.js and npm installed locally.

### Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### Start the backend server
```bash
cd server
npm run dev
# Server listens on http://localhost:4000
```

### Start the frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

The frontend is configured to call the backend at `http://localhost:4000/api` and send credentials (cookies) with each request.

### Demo flow
1. Signup as a **Job Seeker**, entering skills as comma-separated text (e.g. `JavaScript, React, SQL`).
2. Signup as an **Employer**, providing company info.
3. Log in as the employer and use the Employer Dashboard to post a job with required skills.
4. Log in as the job seeker, upload a resume (PDF), browse jobs, view job details, and apply.
5. On the job details page, verify the **Skill Gap Visualizer** shows matched vs missing skills and a match percentage.
6. Check the Job Seeker Dashboard for applied jobs and the Employer Dashboard for applicants.

# -skill-gap-job-portal-mvp
