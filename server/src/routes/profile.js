const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { run, get } = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

router.put('/', requireAuth, async (req, res) => {
  try {
    const { skills, companyName, companyDescription } = req.body;

    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let newSkills = user.skills;
    let newCompanyName = user.company_name;
    let newCompanyDescription = user.company_description;

    if (user.role === 'job_seeker' && typeof skills === 'string') {
      newSkills = skills;
    }

    if (user.role === 'employer') {
      if (typeof companyName === 'string') newCompanyName = companyName;
      if (typeof companyDescription === 'string') newCompanyDescription = companyDescription;
    }

    await run(
      `UPDATE users SET skills = ?, company_name = ?, company_description = ? WHERE id = ?`,
      [newSkills, newCompanyName, newCompanyDescription, user.id]
    );

    const updated = await get(
      'SELECT id, name, email, role, skills, resume_path, company_name, company_description FROM users WHERE id = ?',
      [user.id]
    );

    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resume upload
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf';
    const safeName = `user-${req.user.userId}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post('/resume', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const relativePath = `/uploads/${req.file.filename}`;

    await run('UPDATE users SET resume_path = ? WHERE id = ?', [relativePath, req.user.userId]);

    const updated = await get(
      'SELECT id, name, email, role, skills, resume_path, company_name, company_description FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
