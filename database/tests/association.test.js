const { Collector, Card } = require("../associations");
const db = require("../dbConfig");
const generateData = require('../generateData.js')

describe("the association between Collector and Card Model", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
    await generateData();
  });

  test("that you can create a card", async () => {
    let collector1 = await Collector.findByPk(1)
    const collection = await collector1.getCards()
    expect(collector1.id).toBe(1);
    expect(collection.length).toBe(1);
  });
});
