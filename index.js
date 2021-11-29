const express = require("express");
const app = express();
const PORT = 3000;
const { Card, Collector } = require("./database/associations");

const generateSeedData = require("./database/generateData");
generateSeedData();

//parses incoming json files
app.use(express.json());

//Collector views his colletion
app.get("/collector/:collectorId/inventory", async (req, res, next) => {
  try {
    const collector = await Collector.findByPk(req.params.collectorId);
    const collection = await collector.getCards();
    res.status(200).send(collection);
  } catch (error) {
    return next(error);
  }
});

//Collector checks his budget
app.get("/collector/:collectorId/budget", async (req, res, next) => {
  try {
    const collector = await Collector.findByPk(req.params.collectorId);
    res
      .status(200)
      .send(
        `Welcome ${collector.name}! Your current balance is $${collector.budget}.`
      );
  } catch (error) {
    return next(error);
  }
});

// Generates a pack of 10 cards for a specific collector
app.put("/collector/:collectorId/pack", async (req, res, next) => {
  try {
    const packSize = 10;
    const packIds = [];
    const packCards = [];
    const cardCount = await Card.count(); //currently there's 50 cards in the json file
    //generates a pack of 10 cards that don't contain dupes
    while (packIds.length <= packSize) {
      let cardId = Math.round(Math.random() * (cardCount - 1));
      if (packIds.includes(cardId)) {
      } else {
        packIds.push(cardId);
        let cardInstance = await Card.findByPk(cardId);
        packCards.push(cardInstance);
      }
    }
    //after while loop, add array of cards to specific user
    const collector = await Collector.findByPk(req.params.collectorId);
    await collector.addCards(packCards);
    const additions = await collector.getCards();
    res.status(201).json(additions);
  } catch (error) {
    return next(error);
  }
});

//Collector buys a card
app.post("/collector/:collectorId/purchase/:cardId", async (req, res, next) => {
  try {
    const collector = await Collector.findByPk(req.params.collectorId);
    const card = await Card.findByPk(req.params.cardId); //could also take the parameter (double) approach

    //Makes sure the collector has sufficient money before it can buy the card
    if (collector.budget >= card.cost) {
      const newBudget = collector.budget - card.cost;
      await collector.update({ budget: newBudget });
      await collector.addCard(card);
      res
        .status(201)
        .send(
          `Your purchase of card ${card.name} costing $${card.cost} was successful!`
        );
    } else {
      res
        .status(409)
        .send(
          `Unfortunately we couldn't process your purchase as your balance is $${collector.budget} and the card costs $${card.cost}, please deposit more into your account.`
        );
    }
  } catch (error) {
    return next(error);
  }
});
//Collector sells a card
app.delete("/collector/:collectorId/sale/:cardId", async (req, res, next) => {
  try {
    const collector = await Collector.findByPk(req.params.collectorId);
    const cardArr = await collector.getCards({
      where: { id: req.params.cardId },
    });
    const card = cardArr[0];
    const newBudget = card.cost + collector.budget;
    await collector.update({ budget: newBudget });
    await collector.removeCard(card);
    res
      .status(200)
      .send(
        `Card ID# ${card.id} has been removed from ${collector.name}'s inventory.`
      );
  } catch (error) {
    return next(error);
  }
});

//Collector trades with another collector
app.post("/collector/:collectorId/trade/:traderId", async (req, res, next) => {
  try {
    //collector info
    const collector = await Collector.findByPk(req.params.collectorId);
    const tradingCardId = req.body.tradingCardId;
    const tradingCardArr = await collector.getCards({
      where: { id: tradingCardId },
    });
    const tradingCard = tradingCardArr[0];

    //trader info
    const cardTrader = await Collector.findByPk(req.params.traderId);
    const receivingCardId = req.body.receivingCardId;
    const receivingCardArr = await cardTrader.getCards({
      where: { id: receivingCardId },
    });
    const receivingCard = receivingCardArr[0];

    //trade transaction
    await collector.removeCard(tradingCard);
    await collector.addCard(receivingCard);
    await cardTrader.removeCard(receivingCard);
    await cardTrader.addCard(tradingCard);

    res
      .status(200)
      .send(
        `Collector ${collector.name} has successfull traded card ${tradingCard.id} for ${receivingCard.id} with ${cardTrader.name}.`
      );
  } catch (error) {
    return next(error);
  }
});

//When no method and/or path matches, returns 404
app.use((req, res) => {
  res
    .status(404)
    .send(
      `Sorry, the "${req.method}" method to the path "${req.path}" is not a valid, please change the either the request, path or both.`
    );
  //Ideally a cool 404 page would be rendered
});
//Error handling function
app.use((err, req, res, next) => {
  console.error(`Start of Error:\n ${err} \nEnd of Error`);
  res.status(500).send("Server error, please try again or at some other time.");
  //Ideally a cool 500 page would be rendered
});

app.listen(PORT, () => {
  console.log(`This server on port ${PORT} is operational, PROCEED!`);
});
