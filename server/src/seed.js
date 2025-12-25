const bcrypt = require('bcrypt');
const { run, get, all } = require('./db');

async function ensureUser({ name, email, password, role, skills, company_name, company_description }) {
  const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
  if (existing) return existing;

  const password_hash = await bcrypt.hash(password, 10);
  const result = await run(
    `INSERT INTO users (name, email, password_hash, role, skills, company_name, company_description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password_hash, role, skills || null, company_name || null, company_description || null]
  );
  return get('SELECT * FROM users WHERE id = ?', [result.id]);
}

async function ensureJob(employerId, { title, description, required_skills, location }) {
  const existing = await get('SELECT id FROM jobs WHERE employer_id = ? AND title = ?', [
    employerId,
    title,
  ]);
  if (existing) return existing;

  const result = await run(
    `INSERT INTO jobs (employer_id, title, description, required_skills, location)
     VALUES (?, ?, ?, ?, ?)`,
    [employerId, title, description, required_skills, location]
  );
  return get('SELECT * FROM jobs WHERE id = ?', [result.id]);
}

async function seed() {
  try {
    console.log('Seeding demo data...');

    const employer = await ensureUser({
      name: 'Demo Employer',
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer',
      company_name: 'Acme Corp',
      company_description: 'Demo employer company for ApplySmart (Skill Gap Job Portal MVP).',
    });

    const jobSeeker = await ensureUser({
      name: 'Demo Seeker',
      email: 'seeker@example.com',
      password: 'password123',
      role: 'job_seeker',
      skills: 'JavaScript, React, SQL',
    });

    console.log('Employer id:', employer.id, 'Job seeker id:', jobSeeker.id);

    // Ensure a set of demo tech jobs exist for this employer (idempotent by title)
    const demoJobs = [
      {
        title: 'Frontend Developer (React)',
        description: 'Build and maintain frontend features using React and Tailwind CSS.',
        required_skills: 'JavaScript, React, Tailwind CSS',
        location: 'Remote',
      },
      {
        title: 'Full Stack Developer',
        description: 'Work on both backend (Node.js) and frontend (React).',
        required_skills: 'Node.js, React, SQL',
        location: 'New York, NY',
      },
      {
        title: 'Backend Engineer (Node.js)',
        description: 'Design and build scalable APIs and services using Node.js and Express.',
        required_skills: 'Node.js, Express, SQL, REST APIs',
        location: 'San Francisco, CA',
      },
      {
        title: 'DevOps Engineer',
        description: 'Own CI/CD pipelines and cloud infrastructure for a modern web stack.',
        required_skills: 'AWS, Docker, CI/CD, Linux',
        location: 'Remote',
      },
      {
        title: 'Data Engineer',
        description: 'Build and maintain data pipelines and analytics infrastructure.',
        required_skills: 'SQL, ETL, Data Warehousing, Python',
        location: 'Austin, TX',
      },
      {
        title: 'Mobile Engineer (React Native)',
        description: 'Ship high-quality mobile features using React Native.',
        required_skills: 'JavaScript, React Native, REST APIs',
        location: 'Remote',
      },
      {
        title: 'QA Automation Engineer',
        description: 'Create automated test suites for frontend and backend services.',
        required_skills: 'JavaScript, Testing, Cypress, Jest',
        location: 'Seattle, WA',
      },
    ];

    for (const job of demoJobs) {
      await ensureJob(employer.id, job);
    }

    console.log('Ensured demo tech jobs exist.');

    console.log('Seeding complete. Demo accounts:');
    console.log('  Employer: employer@example.com / password123');
    console.log('  Job Seeker: seeker@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();