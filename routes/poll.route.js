const express = require('express');
const router = express.Router();
const poll = require('../controller/poll.controller');

router.get('/:id', poll.get);

module.exports = router;