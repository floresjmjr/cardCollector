const { Sequelize } = require("sequelize");

const db = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./database/cardCollection.sqlite",
  logging: false, // prevents SQL commands from being on the server console
});

module.exports = db;
