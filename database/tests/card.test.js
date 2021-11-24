const { Card } = require("../associations");
const db = require("../dbConfig");

describe("Card Model", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  test("that you can create a card", async () => {
    const cardInstance = await Card.create({
      name: "Card 1",
      imgURL: "http://something.com",
      cost: 10,
    });
    expect(cardInstance.id).toBe(1);
  });
});
