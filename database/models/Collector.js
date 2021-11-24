const { DataTypes, Model } = require("sequelize");
const db = require('../dbConfig')


class Collector extends Model {}

Collector.init(
  {
    name: DataTypes.STRING,
    budget: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = Collector;
