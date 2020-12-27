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
const dayConvert = 1000 * 60 * 60 * 24;
function handleSubmit(event) {
  event.preventDefault();

  const currentDate = new Date();

  // trip start and end date from form submit
  let startDate = document.getElementById("date-departure").value;
  let endDate = document.getElementById("date-return").value;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  startDate.setFullYear(startDate.getFullYear() - 1);
  console.log(startDate + "     " + endDate);

  //length of trip in nanoseconds
  const tripTime = endDate - startDate;
  //gets length of trip in days
  const lengthOfTrip = tripTime / dayConvert;

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
        getCity(res.baseUrl, res.end, formText, daysTillTrip, daysTillTripEnds);
      });
  }
}

const getCity = async (baseURL, end, city, daysTillTrip, daysTillTripEnds) => {
  try {
    const res = await fetch(baseURL + city + end);
    const data = await res.json();
    getWeather(data.geonames[0], daysTillTrip, daysTillTripEnds);
  } catch (err) {
    console.log(err + "error");
  }
};

const getWeather = async ({ lat, lng }, daysTillTrip, daysTillTripEnds) => {
  let type;
  let daysOfTrip = daysTillTripEnds - daysTillTrip;

  if (daysTillTripEnds < 16 && daysTillTrip > 0) {
    console.log("forecast");
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
          daysOfTrip +
          data.key
      );
      const weatherInfo = await weatherObj.json();
      setUI(weatherInfo);
    } catch (err) {
      console.log(err + "error");
    }
  } else {
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
          "&start_date=2020-12-23&end_date=2020-12-24" +
          data.key
      );
      const weatherInfo = await weatherObj.json();
      setUI(weatherInfo);
    } catch (err) {
      console.log(err + "error");
    }
  }
};

const setUI = (data) => {
  console.log(data.data[0]);
  document.getElementById("placeHolder").innerHTML = data.city_name;
  document.getElementById("description").innerHTML =
    data.data[0].weather.description;
};

export { handleSubmit };
