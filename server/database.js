const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.hehxnyc.mongodb.net/?retryWrites=true&w=majority`;

const isDevelopment = process.env.MODE === "development";

const dbName = isDevelopment ? "memo-test" : "memo";

const { omit } = require("lodash");

const factory = require("./factory");

const { toUTCDate } = require("./date");

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    const client = (this._client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    }));

    await client.connect();

    await client.db("admin").command({ ping: 1 });

    client.on("commandStarted", (event) => console.debug(event));
    client.on("commandSucceeded", (event) => console.debug(event));
    client.on("commandFailed", (event) => console.debug(event));

    console.log("Connected to database");
  }

  close() {
    this._client.close();
  }

  async createCard(options, deckId) {
    let card = factory.createCard({
      ...options,
      _deckId: ObjectId(deckId),
    });

    const { insertedId } = await this._client
      .db(dbName)
      .collection("cards")
      .insertOne(card);

    return {
      ...card,
      _id: insertedId,
    };
  }

  updateCard(cardId, options) {
    options = { ...omit(options, "_id"), modified: toUTCDate() };

    if ("dueDate" in options) {
      options = { ...options, dueDate: toUTCDate(options.dueDate) };
    }

    return this._client
      .db(dbName)
      .collection("cards")
      .updateOne({ _id: ObjectId(cardId) }, { $set: options });
  }

  updateCards(cards) {
    return this._client
      .db(dbName)
      .collection("cards")
      .bulkWrite(
        Object.entries(cards).map(([cardId, options]) => {
          options = { ...omit(options, "_id"), modified: toUTCDate() };

          if ("dueDate" in options) {
            options = { ...options, dueDate: toUTCDate(options.dueDate) };
          }

          return {
            updateOne: {
              filter: { _id: ObjectId(cardId) },
              update: {
                $set: options,
              },
            },
          };
        })
      );
  }

  deleteCard(cardId) {
    return this._client
      .db(dbName)
      .collection("cards")
      .deleteOne({ _id: ObjectId(cardId) });
  }

  deleteCards(cardIds) {
    return this._client
      .db(dbName)
      .collection("cards")
      .deleteMany({ _id: { $in: cardIds.map((cardId) => ObjectId(cardId)) } });
  }

  getCard(cardId) {
    return this._client
      .db(dbName)
      .collection("cards")
      .findOne({ _id: ObjectId(cardId) });
  }

  getCards(deckId) {
    return this._client
      .db(dbName)
      .collection("cards")
      .find({ _deckId: ObjectId(deckId) })
      .toArray();
  }

  async createDeck(options) {
    const deck = factory.createDeck(options);

    const { insertedId } = await this._client
      .db(dbName)
      .collection("decks")
      .insertOne(deck);

    return {
      ...deck,
      _id: insertedId,
    };
  }

  async updateDeck(deckId, options) {
    const { acknowledged } = await this._client
      .db(dbName)
      .collection("decks")
      .updateOne(
        { _id: ObjectId(deckId) },
        {
          $set: Object.assign({
            ...omit(options, "_id"),
            modified: toUTCDate(),
          }),
        }
      );

    return acknowledged;
  }

  async deleteDeck(deckId) {
    const { acknowledged } = await this._client
      .db(dbName)
      .collection("decks")
      .deleteOne({ _id: ObjectId(deckId) });

    return acknowledged;
  }

  async getDeck(deckId) {
    const deck = await this._client
      .db(dbName)
      .collection("decks")
      .findOne({ _id: ObjectId(deckId) });

    const cardsCount = await this._getCardsCount(deckId);

    return {
      ...deck,
      cardsCount,
    };
  }

  async getDecks() {
    const decks = await this._client
      .db(dbName)
      .collection("decks")
      .find({})
      .toArray();

    let cardsCounts = {};

    for (let deck of decks) {
      const cardsCount = await this._getCardsCount(deck._id);

      cardsCounts = { ...cardsCounts, [deck._id]: cardsCount };
    }

    return decks.map((deck) => {
      return {
        ...deck,
        cardsCount: cardsCounts[deck._id],
      };
    });
  }

  async _getCardsCount(deckId) {
    const all = await this._client
      .db(dbName)
      .collection("cards")
      .countDocuments({ _deckId: ObjectId(deckId) });

    const due = await this._client
      .db(dbName)
      .collection("cards")
      .countDocuments({
        _deckId: ObjectId(deckId),
        paused: { $ne: true },
        dueDate: { $lt: new Date() },
      });

    return { all, due };
  }
}

const database = new Database();

process.on("SIGINT", () => database.close());
process.on("SIGTERM", () => database.close());

module.exports = database;
