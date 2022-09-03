require("dotenv").config();

const { toUTCDate } = require('../server/date');

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.hehxnyc.mongodb.net/?retryWrites=true&w=majority`;

const client = (this._client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
}));

(async () => {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    client.on("commandStarted", (event) => console.debug(event));
    client.on("commandSucceeded", (event) => console.debug(event));
    client.on("commandFailed", (event) => console.debug(event));

    console.log("Connected to database");

    // update
    const decks = await client.db("memo").collection("decks").find().toArray();

    for (let deck of decks) {
      await client.db("memo").collection("decks").updateOne(
        {_id: deck._id},
        {
          $set: {
            created: toUTCDate(deck.created),
            modified: toUTCDate(deck.modified)
          },
        }
      );
    }

    const cards = await client.db("memo").collection("cards").find().toArray();

    for (let card of cards) {
      await client.db("memo").collection("cards").updateOne(
        {_id: card._id},
        {
          $set: {
            created: toUTCDate(card.created),
            dueDate: toUTCDate(card.dueDate),
            modified: toUTCDate(card.modified)
          },
        }
      );
    }
  } finally {
    client.close();
  }
})();
