const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const keys = require('./config/keys');

const app = express();

require("./routes")(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
