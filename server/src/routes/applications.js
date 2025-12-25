const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth, requireRole } = require('../auth');

const router = express.Router();

// Apply to a job (job seeker)
router.post('/jobs/:id/apply', requireAuth, requireRole('job_seeker'), async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    const job = await get('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user || !user.resume_path) {
      return res.status(400).json({ error: 'You must upload a resume before applying' });
    }

    const existing = await get('SELECT id FROM applications WHERE job_id = ? AND user_id = ?', [
      jobId,
      userId,
    ]);
    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const result = await run(
      `INSERT INTO applications (job_id, user_id, resume_path)
       VALUES (?, ?, ?)`,
      [jobId, userId, user.resume_path]
    );

    const application = await get('SELECT * FROM applications WHERE id = ?', [result.id]);
    res.status(201).json({ application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Job seeker dashboard: applied jobs
router.get('/job-seeker/applications', requireAuth, requireRole('job_seeker'), async (req, res) => {
  try {
    const applications = await all(
      `SELECT applications.*, jobs.title, jobs.location, users.company_name
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN users ON jobs.employer_id = users.id
       WHERE applications.user_id = ?
       ORDER BY applications.applied_at DESC`,
      [req.user.userId]
    );
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employer: applicants for a job
router.get(
  '/employer/jobs/:id/applicants',
  requireAuth,
  requireRole('employer'),
  async (req, res) => {
    try {
      const jobId = parseInt(req.params.id, 10);

      const job = await get('SELECT * FROM jobs WHERE id = ?', [jobId]);
      if (!job || job.employer_id !== req.user.userId) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const applicants = await all(
        `SELECT applications.*, users.name, users.resume_path
         FROM applications
         JOIN users ON applications.user_id = users.id
         WHERE applications.job_id = ?
         ORDER BY applications.applied_at DESC`,
        [jobId]
      );

      res.json({ applicants });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
