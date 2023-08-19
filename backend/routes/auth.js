const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');

router.get('/profile', checkRole('user'), (req, res) => {
  res.send('user profile');
});

module.exports = router;