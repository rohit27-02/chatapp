const express = require("express");
const router = express.Router();
const {getFriendsList} = require("../middleware/friend");

router.get("/friends/:id",getFriendsList);

module.exports = router;
