const express = require('express');
const authValidateJWT = require('../auth');
const router = express.Router();
const poll = require('../controller/poll.controller');

router.get('/:id', poll.get);

module.exports = router;