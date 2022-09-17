const { isUndefined } = require("lodash");

const path = require("path");

const database = require("./database");

const express = require("express");

const auth = require("./auth");

const router = express.Router();

router.get(
  ["/", "/create-card", "/create-deck", "/decks", "/decks/*"],
  auth,
  (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  }
);

const apiRouter = express.Router();

/**
 * Get all decks.
 */
apiRouter.get("/decks", auth, async (req, res) => {
  const decks = await database.getDecks();

  return res.json(decks);
});

/**
 * Get deck with ID.
 */
apiRouter.get("/decks/:deckId", auth, async (req, res) => {
  const { deckId } = req.params;

  const deck = await database.getDeck(deckId);

  if (!deck) {
    return res.status(404).send('Deck not found');
  }

  res.json(deck);
});

/**
 * Create deck.
 */
apiRouter.post("/decks", auth, express.json(), async (req, res) => {
  let { deck } = req.body;

  deck = await database.createDeck(deck);

  res.json(deck);
});

/**
 * Update deck.
 */
apiRouter.put("/decks/:deckId", auth, express.json(), async (req, res) => {
  const { deckId } = req.params;

  let { deck } = req.body;

  const success = await database.updateDeck(deckId, deck);

  if (!success) {
    res.status(400).send("Deck not updated");
  }

  res.status(200).send("Deck updated");
});

/**
 * Delete deck.
 */
apiRouter.delete("/decks/:deckId", auth, async (req, res) => {
  const { deckId } = req.params;

  const success = await database.deleteDeck(deckId);

  if (!success) {
    res.status(400).send("Deck not deleted");
  }

  res.status(200).send("Deck deleted");
});

/**
 * Get card with ID.
 */
apiRouter.get("/decks/:deckId/cards/:cardId", auth, async (req, res) => {
  const { cardId } = req.params;

  const card = await database.getCard(cardId);

  if (!card) {
    return res.status(404).send('Card not found');
  }

  res.json(card);
});

/**
 * Get cards.
 */
apiRouter.get("/decks/:deckId/cards", auth, async (req, res) => {
  const { deckId } = req.params;

  const cards = await database.getCards(deckId);

  res.json(cards);
});

/**
 * Create card.
 */
apiRouter.post(
  "/decks/:deckId/cards",
  auth,
  express.json(),
  async (req, res) => {
    const { deckId } = req.params;

    let { card } = req.body;

    card = await database.createCard(card, deckId);

    res.json(card);
  }
);

/**
 * Update cards.
 */
apiRouter.put(
  "/decks/:deckId/cards",
  auth,
  express.json(),
  async (req, res) => {
    const { cards } = req.body;

    const success = await database.updateCards(cards);

    if (!success) {
      res.status(400).send("Cards not updated");
    }

    res.status(200).send("Cards updated");
  }
);

/**
 * Update card.
 */
apiRouter.put(
  "/decks/:deckId/cards/:cardId",
  auth,
  express.json(),
  async (req, res) => {
    const { cardId } = req.params;

    let { card } = req.body;

    const success = await database.updateCard(cardId, card);

    if (!success) {
      res.status(400).send("Card not updated");
    }

    res.status(200).send("Card updated");
  }
);

/**
 * Delete card.
 */
apiRouter.delete("/decks/:deckId/cards/:cardId", auth, async (req, res) => {
  const { cardId } = req.params;

  const success = await database.deleteCard(cardId);

  if (!success) {
    res.status(400).send("Card not deleted");
  }

  res.status(200).send("Card deleted");
});

/**
 * Delete cards.
 */
apiRouter.delete("/decks/:deckId/cards", auth, async (req, res) => {
  const { cards } = req.query;

  const success = await database.deleteCards(cards.split(','));

  if (!success) {
    res.status(400).send("Cards not deleted");
  }

  res.status(200).send("Cards deleted");
});

router.use("/api", apiRouter);

module.exports = router;