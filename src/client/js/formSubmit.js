// At least one of these is required, but the rest are great additional ways to further customize and improve your project!
// Add end date and display length of trip.
// Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
// Allow user to add multiple destinations on the same trip.
// Pull in weather for additional locations.
// Allow the user to add hotel and/or flight data.
// Multiple places to stay? Multiple flights?
// Integrate the REST Countries API to pull in data for the country being visited.
// Allow the user to remove the trip.
// Use Local Storage to save the data so that when they close, then revisit the page, their information is still there.
// Instead of just pulling a single day forecast, pull the forecast for multiple days.
// Incorporate icons into forecast.
// Allow user to Print their trip and/or export to PDF.
// Allow the user to add a todo list and/or packing list for their trip.
// Allow the user to add additional trips (this may take some heavy reworking, but is worth the challenge).
// Automatically sort additional trips by countdown.
// Move expired trips to bottom/have their style change so it’s clear it’s expired.
import countries from "i18n-iso-countries";
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const dayConvert = 1000 * 60 * 60 * 24;
function handleSubmit(event) {
  event.preventDefault();

  const currentDate = new Date();

  // trip start and end date from form submit
  let startDate = document.getElementById("date-departure").value;
  let endDate = document.getElementById("date-return").value;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  //time till the trip starts in nanoseconds
  const timeTillTrip = new Date(startDate) - currentDate;
  //time till trip starts in days
  const daysTillTrip = Math.floor(timeTillTrip / dayConvert);
  //time till the trip ends in nanoseconds
  const timeTillTripEnds = new Date(endDate) - currentDate;
  //conver to days
  const daysTillTripEnds = Math.floor(timeTillTripEnds / dayConvert);

  let formText = document.getElementById("city").value;
  if (formText) {
    fetch("http://localhost:3000/city")
      .then((res) => res.json())
      .then((res) => {
        getCity(
          res.baseUrl,
          res.end,
          formText,
          daysTillTrip,
          daysTillTripEnds,
          startDate,
          endDate
        );
      });
  }
}

const getCity = async (
  baseURL,
  end,
  city,
  daysTillTrip,
  daysTillTripEnds,
  startDate,
  endDate
) => {
  try {
    const res = await fetch(baseURL + city + end);
    const data = await res.json();
    getWeather(
      data.geonames[0],
      daysTillTrip,
      daysTillTripEnds,
      startDate,
      endDate
    );
  } catch (err) {
    console.log(err + "error");
  }
};

const getWeather = async (
  { lat, lng },
  daysTillTrip,
  daysTillTripEnds,
  startDate
) => {
  let type;
  let histStartDate = formatDate(startDate);
  let histEndDate = formatDate2(startDate);

  if (daysTillTripEnds <= 16 && daysTillTrip > 0) {
    type = "forecast";
    try {
      const res = await fetch("http://localhost:3000/weather");
      const data = await res.json();
      const weatherObj = await fetch(
        data.baseUrl +
          type +
          data.type +
          lat +
          data.mid +
          lng +
          data.days +
          data.key
      );
      const weatherInfo = await weatherObj.json();

      let src = await getPicture(
        weatherInfo.city_name,
        weatherInfo.country_code
      );
      postData(weatherInfo, daysTillTrip, daysTillTripEnds, src, type);
    } catch (err) {
      console.log(err + "error");
    }
  } else if (daysTillTrip > 0) {
    type = "history";
    try {
      const res = await fetch("http://localhost:3000/weather");
      const data = await res.json();
      const weatherObj = await fetch(
        data.baseUrl +
          type +
          data.type +
          lat +
          data.mid +
          lng +
          "&start_date=" +
          histStartDate +
          "&end_date=" +
          histEndDate +
          data.key
      );
      const weatherInfo = await weatherObj.json();
      let src = await getPicture(
        weatherInfo.city_name,
        weatherInfo.country_code
      );
      postData(weatherInfo, daysTillTrip, daysTillTripEnds, src, type);
    } catch (err) {
      console.log(err + "error");
    }
  } else {
    console.log("That's in the past baby");
  }
};

const postData = async (data, daysTillTrip, daysTillTripEnds, src, type) => {
  let days = [];
  let daily = data.data;
  let tripDays = [];
  if (type === "forecast") {
    if (daysTillTrip !== daysTillTripEnds) {
      for (let i = daysTillTrip + 1; i <= daysTillTripEnds + 1; i++) {
        days.push(i);
      }

      tripDays = daily.filter((day, index) => days.includes(index));
    } else {
      tripDays = daily[daysTillTrip];
    }
  }
  if (type === "history") {
    tripDays = data.data;
  }
  let dataObj = {
    city_name: data.city_name,
    timezone: data.timezone,
    weather: tripDays,
    daysTillTrip,
    daysTillTripEnds,
    src,
    type,
  };
  const res = await fetch("http://localhost:3000/add", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObj),
  });
  try {
    const newData = await res.json();
    buildUI(newData);
  } catch (error) {
    console.log("error in post", error);
  }
};

const buildUI = (tripInfo) => {
  console.log(tripInfo);
  const container = document.getElementById("tripContainer");

  tripInfo.map((trip) => {
    const cityName = document.createElement("h1");
    cityName.innerHTML = trip.city_name;

    const cityImg = document.createElement("img");
    cityImg.src = trip.src;
    cityImg.alt = "Trip Picture";
    cityImg.display = "flex";
    trip.weather.map((day) => {
      if (trip.type === "forecast") {
        const icon = document.createElement("img");
        icon.src =  `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`;
        icon.alt = "weather icon";


        console.log(icon)
        const date = document.createElement("h4");
        date.innerHTML = day.datetime;

        const desc = document.createElement("h6");
        desc.innerHTML = day.weather.description;

        const temp = document.createElement("h6");
        temp.innerHTML = `High: ${day.max_temp} Low: ${day.low_temp}`;

        const rain = document.createElement("h6");
        rain.innerHTML = `Chance of rain is ${day.pop}%`;

        const cloud = document.createElement("h6");
        cloud.innerHTML = `Cloud coverage ${day.clouds}%`;

        const uv = document.createElement("h6");
        uv.innerHTML = `UV index is a ${Math.round(day.uv * 10) / 10}`;

        cityName.insertAdjacentElement("beforeend", date);
        cityName.insertAdjacentElement("beforeend", icon);
        cityName.insertAdjacentElement("beforeend", desc);
        cityName.insertAdjacentElement("beforeend", temp);
        cityName.insertAdjacentElement("beforeend", rain);
        cityName.insertAdjacentElement("beforeend", cloud);
        cityName.insertAdjacentElement("beforeend", uv);
      } else {
        const desc = document.createElement("h4");
        desc.innerHTML = `A typical day that time of year is:`;

        const temp = document.createElement("h6");
        temp.innerHTML = `High: ${day.max_temp} Low: ${day.min_temp}`;

        const rain = document.createElement("h6");
        rain.innerHTML = `${day.precip} inches of rain`;

        const clouds = document.createElement("h6");
        clouds.innerHTML = `${day.clouds}% cloud coverage`;

        const wind = document.createElement("h6");
        wind.innderHTML = `${day.wind_speed} mph wind speed`;

        const snow = document.createElement("h6");
        snow.innerHTML = `${day.snow} inches of snow`;

        cityName.insertAdjacentElement("beforeend", desc);
        cityName.insertAdjacentElement("beforeend", temp);
        cityName.insertAdjacentElement("beforeend", rain);
        cityName.insertAdjacentElement("beforeend", clouds);
        cityName.insertAdjacentElement("beforeend", wind);
        cityName.insertAdjacentElement("beforeend", snow);
      }

      container.insertAdjacentElement("beforeend", cityImg);
      container.insertAdjacentElement("beforeend", cityName);
    });
  });
};
const forecastUI = (data, daysTillTrip, daysTillTripEnds, src, type) => {
  document.getElementById("description").innerHTML =
    data.data[0].weather.description;
  document.getElementById("windSpeed").innerHTML = data.data[0].wind_spd;
  document.getElementById("highTemp").innerHTML = data.data[0].high_temp;
  document.getElementById("lowTemp").innerHTML = data.data[0].low_temp;
  document.getElementById("chanceOfRain").innerHTML = data.data[0].pop;
  document.getElementById("clouds").innerHTML = data.data[0].clouds;
  document.getElementById("uv").innerHTML = data.data[0].uv;
  document.getElementById(
    "sunTime"
  ).innerHTML = `Sunrise at ${data.data[0].sunrise_ts} and Sunset at ${data.data[0].sunset_ts}`;

  const icon = document.getElementById("weatherIcon");
  icon.style.display = "flex";
  icon.src = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
  icon.alt = "Weather Icon";
};

const histUI = (data, daysTillTrip, daysTillTripEnds, src, type) => {
  console.log(data.data[0]);
  console.log("Histroy check worked");
  console.log(daysTillTrip + "    " + daysTillTripEnds);
  console.log(Math.floor(daysTillTrip / 7) + "weeks");
  console.log((daysTillTrip % 7) + " days");
  console.log(daysTillTripEnds - daysTillTrip + 1 + "days long trip");

  document.getElementById("windSpeed").innerHTML = data.data[0].wind_spd;
  document.getElementById("highTemp").innerHTML = data.data[0].temp;
  document.getElementById("chanceOfRain").innerHTML = data.data[0].precip;
  document.getElementById("clouds").innerHTML = data.data[0].clouds;
  document.getElementById("snow").innerHTML = data.data[0].snow;
};

const formatDate = (date) => {
  let currentYear = new Date();
  date.setFullYear(currentYear.getFullYear() - 1);
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const formatDate2 = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + (d.getDate() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const getPicture = async (city_name, country_code) => {
  city_name = city_name.split(" ");
  city_name = city_name.join("+");
  const res = await fetch("http://localhost:3000/picture");
  const data = await res.json();

  let picData = await fetch(data.key + city_name + data.end);
  let finalData = await picData.json();
  if (!finalData.hits[0]) {
    let selector = countries.getName(`${country_code}`, "en", {
      select: "official",
    });
    selector = selector.split(" ");
    selector = selector.join("+");
    picData = await fetch(data.key + selector + data.end);
    finalData = await picData.json();
  }

  const picChoice = Math.floor(Math.random() * finalData.hits.length);
  const src = finalData.hits[picChoice].largeImageURL;
  return src;
};

export { handleSubmit };
