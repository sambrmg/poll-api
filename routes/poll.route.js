const express = require('express');
const authValidateJWT = require('../auth');
const router = express.Router();
const poll = require('../controller/poll.controller');

router.get('/p/:id', poll.get);
router.put('/', poll.vote);

// with auth
router.get('/my-polls', authValidateJWT, poll.getAllPollsByUser);
router.post('/', authValidateJWT,  poll.create);

module.exports = router;