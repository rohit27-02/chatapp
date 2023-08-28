const express = require('express');
const router = express.Router();
const {Getchat} = require('../middleware/chat');

router.get('/chats/:id', Getchat);

module.exports = router;