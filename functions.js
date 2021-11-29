
async function isDupe(cardId, size){
    const starterPackSize = 10;
    const starterPackIds = [];
    const starterPackCards = [];
    //generates a pack of 10 cards that don't contain dupes
    while (starterPackIds.length <= starterPackSize) {
      let cardId = Math.round(Math.random() * (50 - 1));
      if (starterPackIds.includes(cardId)) {
      } else {
        starterPackIds.push(cardId);
        let cardInstance = await Card.findByPk(cardId);
        starterPackCards.push(cardInstance);
      }
    }
}

module.exports = isDupe