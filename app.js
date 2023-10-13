const express = require("express");
const app = express();
const path = require("path");

const scraper = require("./api/routes/scraper");

app.use("/scraper", scraper);

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
