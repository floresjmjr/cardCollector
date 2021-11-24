const { Collector } = require("../associations");
const db = require("../dbConfig");

describe("Collector Model", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  test("that you can create a card", async () => {
    const collectorInstance = await Collector.create({
      name: "Card 1",
      budget: 120,
    });
    console.log(collectorInstance.id)
    expect(collectorInstance.id).toBe(1);
  });
});
