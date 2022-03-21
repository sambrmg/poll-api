module.exports = (sequelize, Sequelize) => {
    const PollOption = sequelize.define("PollOption", {
      title: {
        type: Sequelize.STRING,
      },
      answer: {
        type: Sequelize.INTEGER
      },
      idPoll: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        references: {
           model: 'Polls',
           key: 'id',
        }
     }
    });
    return PollOption;
  };