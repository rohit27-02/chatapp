const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');

router.get('/user', checkRole('user'), (req, res) => {
  res.send(true);
});

module.exports = router;