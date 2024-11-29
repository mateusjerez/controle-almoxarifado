module.exports = {
  HOST: "", // localhost  
  USER: "", // user name for DB
  PASSWORD: "", // password for DB
  DB: "", // DB name
  dialect: "", // DB type
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
