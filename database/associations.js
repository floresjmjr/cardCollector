const db = require('./dbConfig')
const Card = require('./models/Card')
const Collector = require('./models/Collector')

Collector.hasMany(Card)
Card.belongsTo(Collector)

//cant you have the same card 'same name' be owned by multiple collectors??


module.exports = {Card, Collector}