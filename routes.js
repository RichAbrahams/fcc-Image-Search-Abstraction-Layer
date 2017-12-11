const keys = require('./config/keys');
const fetch = require('node-fetch');

module.exports = app => {

  app.get("/", (req, res) => {
    res.send("no search term provided");
  });

  app.get("/:searchterm", async (req, res) => {
    const searchTerm = req.params.searchterm;
    const offset = req.query.offset;
    console.log(keys);
    res.send("ack")
  });

  app.get("*", async (req, res) => {
    res.send("Error. Please correctly format request. Example: /cats?offset=2")
  });

};

