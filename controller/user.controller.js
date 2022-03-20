const { User } = require('../models');
const crypto = require('crypto');

async function create(req, res, next) {
    try {
      User.create({ 
        username: req.body.username, 
        password: crypto.createHash('sha256').update(req.body.password).digest('hex') })
        .then(data => {
          res.status(200).send({message: 'Registered successfully'});
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user."
          });
      });
    } catch (err) {
      console.error(`Error while creating programming language`, err.message);
      next(err);
    }
}

module.exports = {
  create
};