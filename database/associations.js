const db = require("./dbConfig");
const Card = require("./models/Card");
const Collector = require("./models/Collector");

Collector.hasMany(Card);
Card.belongsTo(Collector);

module.exports = { Card, Collector };
