const express = require('express');
const authValidateJWT = require('../auth');
const router = express.Router();
const poll = require('../controller/poll.controller');

router.get('/:id', poll.get);
router.post('/', authValidateJWT,  poll.create);
router.put('/', poll.vote);

module.exports = router;