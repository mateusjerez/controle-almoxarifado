module.exports = (sequelize, Sequelize) => {
    const Unit = sequelize.define("units", {

      name: {
        type: Sequelize.STRING
      },
      uom: {
        type: Sequelize.STRING
      }

    });
  
    return Unit;
  };  