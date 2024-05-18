module.exports = (sequelize, Sequelize) => {
    const Available = sequelize.define("product_available", {
        productId: {
            type: Sequelize.INTEGER
        },
        standId: {
            type: Sequelize.INTEGER
        }
        });
  
    return Available;
  };  