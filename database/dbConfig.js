const { Sequelize } = require("sequelize");

const db = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./database/cardCollection.sqlite",
});

module.exports = db;
