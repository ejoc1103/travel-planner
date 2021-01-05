const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const geoUrlObject = {
  baseUrl: "http://api.geonames.org/searchJSON?q=",
  end: `&maxRows=10&fuzzy=0.8&username=${process.env.GEO_KEY}`,
};

const weatherUrlObject = {
  key: `&key=${process.env.WEATHER_KEY}`,
  baseUrl: "https://api.weatherbit.io/v2.0/",
  type: "/daily?units=I&lat=",
  mid: "&lon=",
  days: "&days=16",
};

const pixUrlObject = {
  key: `https://pixabay.com/api/?key=${process.env.PIXABY_KEY}&catagory=places&q=`,
  end: `&safesearch=true&image_type=photo&order=popular&per_page=50`,
};

let uiArray = [];

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

app.get("/", (req, res) => {
  res.sendFile("dist/index.html");
});

app.get("/city", (req, res) => {
  res.json(geoUrlObject);
});

app.get("/weather", (req, res) => {
  res.json(weatherUrlObject);
});

app.get("/picture", (req, res) => {
  res.json(pixUrlObject);
});

app.get("/all", (req, res) => {
  res.send(uiArray);
});

app.post("/add", (req, res) => {
  uiArray.push(req.body);
  res.send(uiArray);
  console.log(uiArray);
});

app.post("/remove", (req, res) => {
  uiArray = req.body;
  res.send(uiArray);
  console.log(uiArray);
});

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
