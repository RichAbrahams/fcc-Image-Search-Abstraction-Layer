const keys = require("./config/keys");
const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;

const buildUrl = (searchTerm, offset) => {
  const baseUrl = "https://www.googleapis.com/customsearch/v1";
  const finalUrl = `${baseUrl}?cx=${keys.cx}&key=${
    keys.googleApiKey
  }&q=${searchTerm}&start=${offset}&searchType=image`;
  return finalUrl;
};

const saveRecent = async searchTerm => {
  const client = await MongoClient.connect(keys.dbUrl);
  const db = client.db('isa');
  const col = db.collection('recent');
  await col.insertOne({
    date: Date.now(),
    searchTerm
  });
  client.close();
};

const getRecent = async () => {
  const client = await MongoClient.connect(keys.dbUrl);
  const db = client.db('isa');
  const col = db.collection('recent');
  const results = await db.collection("recent")
    .find()
    .sort({date: -1})
    .limit(10)
    .toArray();
  client.close();
  return results;
};

module.exports = (app, dbRecent) => {
  app.get("/", (req, res) => {
    res.send(
      "Usage:- search: '/search/{searchterm}/{offset}, recent searches: /recent' "
    );
  });

  app.get("/search/:searchterm", async (req, res, next) => {
    try {
      const searchTerm = req.params.searchterm;
      const offset = parseInt(req.query.offset) + 1 || 1;
      const url = buildUrl(searchTerm, offset);
      const results = await fetch(url);
      const resultsJson = await results.json();
      const finalResults = resultsJson.items.map(item => item.image);
      await saveRecent(searchTerm);
      res.json(finalResults);
    } catch (err) {
      next(err);
    }
  });

  app.get("/recent", async (req, res, next) => {
    try {
      const recent = await getRecent();
      const finalResults = recent.map(query => {
        const date = new Date(query.date)
        return Object.assign({}, { searchTerm: query.searchTerm, date: date.toDateString(), time: date.toTimeString() });
      });
      res.json(finalResults);
    } catch (err) {
      next(err);
    }
  });

  app.get("*", async (req, res, next) => {
    res.send("Please ensure request is correctly formatted. Example: search/cats?offset=30");
  });

  app.use((err, req, res, next) => {
    res
      .status(500)
      .send(
        "An error occured.  Please ensure request is correctly formatted. Example: search/cats?offset=30"
      );
  });
};
