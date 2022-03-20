const { User } = require('../models');
const crypto = require('crypto');
const env = require('dotenv').config();

function cryptPassword (password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function create(req, res, next) {
    try {
      const username = req.body.username;
      const password = cryptPassword(req.body.password);

      User.findOne({ where: { username } }).then( user => {
        if(user === null) {
          User.create({ username, password })
            .then(data => {
              res.status(200).send({
                message: 'Registered successfully',
                created: true
              });
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || 'Some error occurred while creating the user.'
              });
          });
        } else {
          res.status(200).send({message: 'This user is already in use'});
        }
      });

    } catch (err) {
      console.error(`Error while creating programming language`, err.message);
      next(err);
    }
}

async function login(req, res, next) {
  const username = req.body.username;
  const password = cryptPassword(req.body.password);

  User.findOne({ where: { username, password } }).then( user => {
  
      const jwt = require('jsonwebtoken');
      
      if( user !== null ) {
        jwt.sign({
          id: user.id,
          username: user.username,
          password: user.password,
        }, process.env.SECRET_KEY, (err, token) => {
            if (err) {
                res.status(500).json({ mensagem: 'JWT error' });

                return;
            }
            res.set('x-access-token', token);
            res.status(201).json({'x-access-token': token});
        });
      }
    }).catch(err => {
      res.status(401);
      res.end();
    })
}

module.exports = {
  create,
  login
};