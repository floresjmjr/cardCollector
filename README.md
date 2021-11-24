# Project1 - Card Collecting Database + Server


### Premise: Your team will be engineering an application that can collect and trade rare cards. You can buy new cards, trade and update your collection, and sell your cards. 

You are required to:

1. **Create a database and the following models:**
    - card -> name, imgURL, cost
    - collector -> name, budget

2. **Create an association between the card table and collector table.**

3. **A card.json file with 10 cards.**

4. **A separate seed file that uses a promise to sync your seed file into your database.**

5. **Your server should have the following routes. You can test these routes using your request URLs on Postman:**
    - A route that will generate a ‘pack of 10’ of cards for the collector. If there are duplicates, do not add the duplicates. These are the collector’s current inventory.
    - A route that can ‘buy’ a card. If a card is bought, it will charge the collector
    - A route that will ‘sell’ a specific card. That card will be replenished into the bank of available cards. The collector should gain money by ‘selling’ a card.
    - A route that can ‘trade’ a card.

