const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const geoUrlObject = {
  key: process.env.GEO_KEY,
  baseUrl: "http://api.geonames.org/searchJSON?q=",
  mid: "&maxRows=10&username=",
};

const weatherUrlObject = {
  key: process.env.WEATHER_KEY,
  baseUrl: "https://api.weatherbit.io/v2.0/daily?units=i&lat=",
  mid: "&lon=",
  days: "&days=",
  befroeKey: "&key=",
};

const app = express();
app.use(cors());
// to use json
app.use(bodyParser.json());
// to use url encoded values
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

app.get("/city", function (req, res) {
  res.json(geoUrlObject);
});

app.get("/weather", function (req, res) {
  res.json(weatherUrlObject);
});

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
