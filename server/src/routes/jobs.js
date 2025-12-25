const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../auth');

const router = express.Router();

// List jobs with optional search, skills, and location filters
router.get('/', async (req, res) => {
  try {
    const { search, skills, location } = req.query;

    let sql = `
      SELECT jobs.*, users.company_name
      FROM jobs
      JOIN users ON jobs.employer_id = users.id
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      sql += ' AND jobs.title LIKE ?';
      params.push(`%${search}%`);
    }

    if (skills) {
      // Simple substring match against required_skills
      sql += ' AND jobs.required_skills LIKE ?';
      params.push(`%${skills}%`);
    }

    if (location) {
      sql += ' AND jobs.location LIKE ?';
      params.push(`%${location}%`);
    }

    sql += ' ORDER BY jobs.created_at DESC';

    const jobs = await all(sql, params);
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Job details
router.get('/:id', async (req, res) => {
  try {
    const job = await get(
      `SELECT jobs.*, users.company_name, users.company_description
       FROM jobs
       JOIN users ON jobs.employer_id = users.id
       WHERE jobs.id = ?`,
      [req.params.id]
    );
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create job (employer only)
router.post('/', requireAuth, requireRole('employer'), async (req, res) => {
  try {
    const { title, description, requiredSkills, location } = req.body;

    if (!title || !description || !requiredSkills || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await run(
      `INSERT INTO jobs (employer_id, title, description, required_skills, location)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.userId, title, description, requiredSkills, location]
    );

    const job = await get('SELECT * FROM jobs WHERE id = ?', [result.id]);
    res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employer's jobs
router.get('/employer/mine', requireAuth, requireRole('employer'), async (req, res) => {
  try {
    const jobs = await all('SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC', [
      req.user.userId,
    ]);
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
