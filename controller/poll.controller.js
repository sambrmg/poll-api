const { Poll, PollOption } = require('../models');

async function create(req, res, next) {
  try {
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

    const generateUniqueId = () => `_${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`;
    
    Poll.create({
      title,
      description,
      code: generateUniqueId(),
      userId: req.userInfo.id
    }).then(poll => {
      console.log(poll)
      res.status(200).send({message: 'Poll created'});
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the user.'
        });
    });

  } catch (err) {
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
}

async function get(req, res, next) {
    try {
        const code = req.params.id;
        

        const poll = await Poll.findOne({ where: { code } });

        const pollOptions = await PollOption.findAll( { where: { idPoll: poll.id } });

        const options = pollOptions.map(option => {
          return {
            id: option.get().id,
            title: option.get().title,
          }
        });

        if(poll !== null) {
          res.json({
              title: poll.title,
              description: poll.description,
              options: options,
        });

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
};