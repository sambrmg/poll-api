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

      const findUser = await User.findOne({ where: { username } });
      
      if(findUser === null) {
        User.create({ username, password })
          .then(user => {

            authenticate(req, res, user, {
              message: 'Registered successfully',
              created: true
            });

          });
      } else {
        res.status(200).send({message: 'This user is already in use'});
      }
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the user.'
      });
    }
}

async function login(req, res, next) {
  const username = req.body.username;
  const password = cryptPassword(req.body.password);

  const user = await User.findOne({ where: { username, password } })
  
  if( user !== null ) {
    authenticate(req, res, user, { username });
  } else {
    res.status(401).json({ message: 'Username or password incorrect' });
  }

}

function authenticate(req, res, user, items) {
  const jwt = require('jsonwebtoken');
  jwt.sign({
    id: user.id,
    username: user.username,
    password: user.password,
  }, process.env.SECRET_KEY, { expiresIn: '7d' }, (err, token) => {
      if (err) {
          res.status(500).json({ mensagem: 'JWT error' });

          return;
      }
      res.set('x-access-token', token);
      res.status(201).json({
        'x-access-token': token,
        ...items
      });
  });
}

module.exports = {
  create,
  login
};