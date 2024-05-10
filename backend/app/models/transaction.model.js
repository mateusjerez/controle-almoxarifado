module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transactions", {
        type: {
            type: Sequelize.ENUM('IN', 'OUT')
        },
        quantity: {
            type: Sequelize.INTEGER
        }
    });

    return Transaction;
};  