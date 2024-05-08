module.exports = (sequelize, Sequelize) => {
    const Stand = sequelize.define("stands", {
      name: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      }
    });
  
    return Stand;
  };  