const { sequelize, Poll, PollOption } = require('../models');
const env = require('dotenv').config();

async function create(req, res, next) {
  
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const title = req.body.title.trim();
    const description = req.body.description.trim();
    if (title === '') {
      return res.status(422).send({message: 'Title is required'});
    }

    if (description === '') {
      return res.status(422).send({message: 'Description is required'});
    }
    
    const optionsFilled = req.body.optionsFilled.filter( item => item.value.trim() !== '');

    if (optionsFilled.length < 2) {
      return res.status(422).send({message: 'Please add two or more options'});
    }
    const generateUniqueId = () => 
      `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`;
    
    const poll = await Poll.create({
      title,
      description,
      code: generateUniqueId(),
      userId: req.userInfo.id
    }, { transaction });

    const pollOptions = optionsFilled.map(item => {
      return {
        title : item.value,
        answer: 0,
        idPoll: poll.id
      }
    });

    await PollOption.bulkCreate(pollOptions, { transaction })

    await transaction.commit(); 

    res.status(200).send({
      message: 'Poll created',
      pollCode: poll.code
    });

  } catch (err) {
    
    if(transaction) {
      await transaction.rollback();
    }

    res.status(500).send({
      message:
        err.message || 'Some error occurred while creating the user.'
    });
  }
}

async function get(req, res, next) {
    try {
        const jwt = req.headers["authorization"];
        
        const jwtService = require("jsonwebtoken");

        const code = req.params.id;

        const poll = await Poll.findOne({ where: { code } });

        const pollOptions = await PollOption.findAll( { where: { idPoll: poll.id } });
        
        let isLoggedIn = false;

        jwtService.verify(jwt, process.env.SECRET_KEY, (err, userInfo) => {
          if(!err && userInfo.id === poll.get().userId) {
            isLoggedIn = true;
          }
        });

        const options = pollOptions.map(option => {
          let resJson = {
            id: option.get().id,
            title: option.get().title,
          }
          
          if(isLoggedIn) {
            resJson.answer = option.get().answer;
          }

          return resJson
        });
        
        let pollJson = {
          title: poll.title,
          description: poll.description,
          options: options,
        };

        if(isLoggedIn) {
          pollJson.sum = pollOptions.reduce((acc, option) => acc + option.get().answer, 0)
        }

        if(poll !== null) {
          res.json(pollJson);
        } else {
          res.status(404).end();
        }
      } catch (err) {
        console.error(`Error while creating programming language`, err.message);
        next(err);
      }
    
}

async function vote(req, res, next) {
  try {
      const id = req.body.id;
      const voted = req.body.voted;


      const pollOptions = await PollOption.findOne( { where: { id } });
      
      if (voted) {
        pollOptions.decrement('answer');
      } else {
        pollOptions.increment('answer');
      }

      res.status(200).end();

    } catch (err) {
      console.error(`Error while creating programming language`, err.message);
      next(err);
    }
  
}

async function getAllPollsByUser(req, res, next) {
  try {

    const polls = await Poll.findAll( 
      { 
        attributes: ['code', 'title'],
        where: { userId: req.userInfo.id } 
      });

    if(polls !== null) {
      res.json(polls);
    } else {
      res.status(404).end();
    }
    
  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
}
module.exports = {
    create,
    get,
    vote,
    getAllPollsByUser
};