const { DataTypes, Model } = require("sequelize");
const db = require('../dbConfig')

class Card extends Model {}

Card.init(
  {
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    cost: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = Card;
