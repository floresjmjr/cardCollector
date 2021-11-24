const path = require("path");
const fs = require("fs").promises;

const db = require("./dbConfig");
const { Card, Collector } = require("./associations");

module.exports = async () => {
  await db.sync({ force: true });

  //get data from both sources
  const cardPath = path.join("./database/data", "cards.json");
  const collectorPath = path.join("./database/data", "collectors.json");

  const rawCardData = await fs.readFile(cardPath);
  const rawCollectorData = await fs.readFile(collectorPath);
  const cardData = JSON.parse(rawCardData);
  const collectorData = JSON.parse(rawCollectorData);

  for (card of cardData) {
    await Card.create(card);
  }
  for (collector of collectorData) {
    let collectorInstance = await Collector.create(collector);
    // I don't think this needs to be added as our first route, generates cards for a specific user, aparently free of charge
    // let id = Math.round(Math.random() * (cardData.length - 1) + 1);
    // let randomCard = await Card.findByPk(id);
    // await collectorInstance.addCard(randomCard);
  }
  console.log('Done generating seed data')
};
