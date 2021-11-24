const express = require("express");
const app = express();
const PORT = 3000;
const { Card, Collector } = require("./database/associations");

const generateSeedData = require("./database/generateData");
generateSeedData();

//parses incoming json files
app.use(express.json());

app.get("/Inventory/:collectorId", async (req, res) => {
  const collector = await Collector.findByPk(req.params.collectorId);
  console.log(collector);
  const collection = await collector.getCards();
  res.status(200).send(collection);
});

app.get("/Budget/:collectorId", async(req, res) =>{
  const collector = await Collector.findByPk(req.params.collectorId)
  res.status(200).send(`Welcome ${collector.name}! Your current balance is $${collector.budget}.`)
})

// Generates a pack of 10 cards for a specific collector
app.put("/starterPack/:collectorId", async (req, res) => {
  try {
    const boosterPackSize = 10;
    const boosterPackIds = [];
    const boosterPackCards = [];
    //generates a pack of 10 cards that don't contain dupes
    while (boosterPackIds.length <= boosterPackSize) {
      let cardId = Math.round(Math.random() * (50 - 1));
      if (boosterPackIds.includes(cardId)) {
      } else {
        boosterPackIds.push(cardId);
        let cardInstance = await Card.findByPk(cardId);
        boosterPackCards.push(cardInstance);
      }
    }
    //after while loop, add array of cards to specific user
    const collector = await Collector.findByPk(req.params.collectorId);
    await collector.addCards(boosterPackCards);
    const additions = await collector.getCards();
    res.status(201).json(additions);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

app.post("/Card/Buy/:collectorId/:cardId", async (req, res) => {
  try {
    const collector = await Collector.findByPk(req.params.collectorId);
    const card = await Card.findByPk(req.params.cardId); //path approach
    //const {card} = req.body        //req.body approach, requires incoming json file
    if (collector.budget >= card.cost) {
      const newBudget = collector.budget - card.cost;
      await collector.update({budget: newBudget})
      await collector.addCard(card);
      res.status(201).send(`Your purchase of card ${card.name} costing $${card.cost} was successful!`);
    } else {
      res
        .status(409)
        .send(
          `Unfortunately we couldn't process your purchase as your balance is $${collector.budget} and the card costs $${card.cost}, please deposit more into your account.`
        );
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

app.delete('/Card/Remove/:collectorId/:cardId', async(req, res)=>{
  const collector = await Collector.findByPk(req.params.collectorId)
  
})


app.listen(PORT, () => {
  console.log(`This server on ${PORT} is operational, PROCEED!`);
});
