const express = require("express");
const app = express();
const PORT = 3000;
const { Card, Collector } = require("./database/associations");

const generateSeedData = require("./database/generateData");
generateSeedData();

//parses incoming json files
app.use(express.json());

app.get("/cardCollection/:id", async (req, res) => {
  let collector = await Collector.findByPk(req.params.id);
  console.log(collector);
  let collection = await collector.getCards();
  res.send(collection);
});

app.put("/boosterPack/:collectorId", async (req, res) => {
  //obtain card ids that aren't duplicates
  // const maxCards = await Card.count()
  // const collectorId = req.params.id
  try {
    const boosterPackSize = 10;
    const boosterPackIds = [];
    const boosterPackCards = [];
    while (boosterPackIds.length <= boosterPackSize) {
      let cardId = Math.round(Math.random() * (50 - 1));
      if (boosterPackIds.includes(cardId)) {
      } else {
        boosterPackIds.push(cardId);
        let cardInstance = await Card.findByPk(cardId);
        boosterPackCards.push(cardInstance);
      }
      console.log("==========", boosterPackIds.length);
    }
    //after while loop, add array of cards to specific user
    const collector = await Collector.findByPk(req.params.collectorId);
    await collector.addCards(boosterPackCards);
    const additions = await collector.getCards();
    res.status(201).json(additions);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});



app.listen(PORT, () => {
  console.log(`This server on ${PORT} is operational, PROCEED!`);
});
