const express = require('express');
const bcrypt = require('bcrypt');
const { run, get } = require('../db');
const { createToken, setAuthCookie, clearAuthCookie, requireAuth } = require('../auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, skills, companyName, companyDescription } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['job_seeker', 'employer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, skills, company_name, company_description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        passwordHash,
        role,
        role === 'job_seeker' ? (skills || '') : null,
        role === 'employer' ? (companyName || '') : null,
        role === 'employer' ? (companyDescription || '') : null,
      ]
    );

    const user = await get('SELECT id, name, email, role, skills, resume_path, company_name, company_description FROM users WHERE id = ?', [
      result.id,
    ]);

    const token = createToken(user);
    setAuthCookie(res, token);

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      resume_path: user.resume_path,
      company_name: user.company_name,
      company_description: user.company_description,
    };

    const token = createToken(safeUser);
    setAuthCookie(res, token);

    res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await get(
      'SELECT id, name, email, role, skills, resume_path, company_name, company_description FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
