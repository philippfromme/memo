require("dotenv").config();

const dayjs = require("dayjs");

const { random } = require("lodash");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.hehxnyc.mongodb.net/?retryWrites=true&w=majority`;

const client = (this._client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
}));

const factory = require("../server/factory");

(async () => {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    client.on("commandStarted", (event) => console.debug(event));
    client.on("commandSucceeded", (event) => console.debug(event));
    client.on("commandFailed", (event) => console.debug(event));

    console.log("Connected to database");

    // decks
    await client.db("memo-test").collection("decks").deleteMany({});

    const { insertedId: _deckId } = await client
      .db("memo-test")
      .collection("decks")
      .insertOne(factory.createDeck({ name: "Swedish" }));

    // cards
    await client.db("memo-test").collection("cards").deleteMany({});

    await client
      .db("memo-test")
      .collection("cards")
      .insertMany([
        factory.createCard({ front: "ich", back: "jag", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "er", back: "han", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "sie", back: "hun", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "wir", back: "vi", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "ihr", back: "ni", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "hallo", back: "hey", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "nein", back: "nej", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "gut", back: "bra", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
        factory.createCard({ front: "foo/bar/baz/foo/bar/baz/foo/bar/baz", back: "bra", tags: getRandomTags(), _deckId: ObjectId(_deckId), }),
      ]);
  } finally {
    client.close();
  }
})();

function getRandomTags() {
  const start = random(1),
        end = random(start, 2);

  return [ 'foo', 'bar', 'baz' ].slice(start, end);
}
