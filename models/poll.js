module.exports = (sequelize, Sequelize) => {
    const Poll = sequelize.define("Poll", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        }
    });
    return Poll;
};