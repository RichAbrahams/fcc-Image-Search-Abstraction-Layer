const keys = require('./config/keys');
const fetch = require('node-fetch');

const buildUrl = (searchTerm, offset) => {
  const baseUrl = "https://www.googleapis.com/customsearch/v1";
  const finalUrl = `${baseUrl}?cx=${keys.cx}&key=${keys.googleApiKey}&q=${searchTerm}&start=${offset}&searchType=image`;
  return finalUrl;
}

module.exports = app => {

  app.get("/", (req, res) => {
    res.send("no search term provided");
  });

  app.get("/:searchterm", async (req, res) => {
    try {
      const searchTerm = req.params.searchterm;
      const offset = req.query.offset + 1 || 1;
      const url = buildUrl(searchTerm, offset);
      const results = await fetch(url);
      const resultsJson = await results.json();
      const finalResults = resultsJson.items.map(item => item.image);
      res.json(finalResults);
    } catch (err) {
      res.send(err);
    }
  });

  app.get("*", async (req, res) => {
    res.send("Error. Please correctly format request. Example: /cats?offset=30")
  });

};

