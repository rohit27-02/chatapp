const express = require('express');
const router = express.Router();
const register = require("../middleware/login");

router.post('/login', register);

module.exports = router;