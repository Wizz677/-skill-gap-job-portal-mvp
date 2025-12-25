const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('job_seeker', 'employer')),
      skills TEXT,
      resume_path TEXT,
      company_name TEXT,
      company_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employer_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      required_skills TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      resume_path TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(job_id, user_id),
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed a demo employer and several tech jobs if the jobs table is empty.
  db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
    if (err) {
      console.error('Error checking jobs count for seed:', err);
      return;
    }
    if (!row || row.count > 0) {
      return; // Already have jobs, skip seeding
    }

    db.run(
      `INSERT INTO users (name, email, password_hash, role, company_name, company_description)
       VALUES (?, ?, ?, 'employer', ?, ?)`,
      [
        'ApplySmart Tech',
        'demo-employer@example.com',
        // This is just a placeholder; it is not meant for real login
        'seed-placeholder-hash',
        'ApplySmart Tech',
        'A demo tech company used for seeded job listings in the MVP.',
      ],
      function (userErr) {
        if (userErr) {
          console.error('Error inserting seed employer:', userErr);
          return;
        }

        const employerId = this.lastID;

        const seedJobs = [
          {
            title: 'Frontend Developer (React + Vite)',
            location: 'Remote / Global',
            required_skills:
              'React, JavaScript (ES6+), Vite, Tailwind CSS, REST APIs, Git',
            description:
              'Build responsive UI components for the ApplySmart job portal using React, Vite, and Tailwind. Work closely with design to ship polished user experiences.',
          },
          {
            title: 'Backend Engineer (Node.js + Express)',
            location: 'Remote / EU Timezones',
            required_skills:
              'Node.js, Express, SQLite/PostgreSQL, REST API design, JWT auth',
            description:
              'Design and maintain secure backend APIs for job search, applications, and the Skill Gap Visualizer logic.',
          },
          {
            title: 'Full-Stack Developer (React/Node)',
            location: 'San Francisco, CA (Hybrid)',
            required_skills:
              'React, Node.js, Express, SQL, Git, Docker, Testing (Jest/Vitest)',
            description:
              'Own features end-to-end across the ApplySmart stack, from database schema changes to frontend UI polish.',
          },
          {
            title: 'DevOps Engineer (CI/CD & Cloud)',
            location: 'Remote / US',
            required_skills:
              'CI/CD pipelines, GitHub Actions, Docker, Linux, Monitoring, Vercel/Netlify',
            description:
              'Set up and maintain CI/CD pipelines and observability for the ApplySmart MVP and related services.',
          },
          {
            title: 'Junior Software Engineer (Entry-Level)',
            location: 'Bangalore, India (On-site)',
            required_skills:
              'JavaScript, HTML, CSS, basic React, basic Node.js, Git, problem solving',
            description:
              'Work with a small team to implement features and fix bugs across the ApplySmart codebase, with strong mentorship.',
          },
        ];

        const stmt = db.prepare(
          `INSERT INTO jobs (employer_id, title, description, required_skills, location)
           VALUES (?, ?, ?, ?, ?)`
        );

        seedJobs.forEach((job) => {
          stmt.run(employerId, job.title, job.description, job.required_skills, job.location);
        });

        stmt.finalize((finalizeErr) => {
          if (finalizeErr) {
            console.error('Error finalizing seed jobs insert:', finalizeErr);
          } else {
            console.log('Seeded demo employer and tech jobs into database.');
          }
        });
      }
    );
  });
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  db,
  run,
  get,
  all,
};
