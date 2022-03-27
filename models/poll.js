module.exports = (sequelize, Sequelize) => {
    const Poll = sequelize.define("Poll", {
        title: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
               model: 'Users',
               key: 'id', 
            }
         }
    });
    return Poll;
};