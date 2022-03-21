const { Poll, PollOption } = require('../models');

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
    get
};