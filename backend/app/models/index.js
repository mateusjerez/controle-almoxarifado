const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.stand = require("./stand.model.js")(sequelize, Sequelize);
db.unit = require("./unit.model.js")(sequelize,Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.product.belongsToMany(db.stand, {
  through: "product_available"
});
db.stand.belongsToMany(db.product, {
  through: "product_available"
})

db.product.belongsToMany(db.unit, {
  through: "product_unit"
})
db.unit.belongsToMany(db.product, {
  through: "product_unit"
})

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;