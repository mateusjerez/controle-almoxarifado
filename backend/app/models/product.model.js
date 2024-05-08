module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
      name: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      }
    });
  
    return Product;
  };  