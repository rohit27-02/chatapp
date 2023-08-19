const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');

router.get('/dashboard', checkRole('admin'), (req, res) => {
  res.send('Admin dashboard');
});

module.exports = router;