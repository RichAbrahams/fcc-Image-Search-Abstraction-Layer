const keys = require('./config/keys');
const fetch = require('node-fetch');

const buildUrl = (searchTerm, offset) => {
  const baseUrl = "https://www.googleapis.com/customsearch/v1";
  const finalUrl = `${baseUrl}?cx=${keys.cx}&key=${keys.googleApiKey}&q=${searchTerm}&start=${offset}&searchType=image`;
  return finalUrl;
}

module.exports = app => {

  app.get("/", (req, res) => {
    res.send("No search term provided");
  });

  app.get("/:searchterm", async (req, res, next) => {
    try {
      const searchTerm = req.params.searchterm;
      const offset = parseInt(req.query.offset) + 1 || 1;
      const url = buildUrl(searchTerm, offset);
      const results = await fetch(url);
      const resultsJson = await results.json();
      const finalResults = resultsJson.items.map(item => item.image);
      res.json(finalResults);
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    res.status(500).send('An error occured.  Please ensure request is correctly formatted. Example: /cats?offset=30')
  })

};

