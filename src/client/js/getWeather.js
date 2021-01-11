import { getPicture } from "./getPicture";
import { postData } from "./postData";
import { formatDate, formatDate2 } from "./formatDates";
// gets us our weathe data
const getWeather = async (
  { lat, lng },
  daysTillTrip,
  daysTillTripEnds,
  startDate
) => {
  let type;
  //checks if the trip is starting more than 16 days from now to make sure we
  //only call for current weather on trips that are soon
  if (daysTillTrip <= 16 && daysTillTripEnds > 0) {
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
      //sends city name and country code to pixabay api needs both in case their or no pics of the city
      let { src, cityFound } = await getPicture(
        weatherInfo.city_name,
        weatherInfo.country_code
      );
      //makes sure that you ender a return date that is later than your depart date
      if (daysTillTrip <= daysTillTripEnds) {
        postData(
          weatherInfo,
          daysTillTrip,
          daysTillTripEnds,
          src,
          cityFound,
          type
        );
      } else {
        let errorText = document.getElementById("errorText");
        errorText.innerHTML = `Sorry! Buy you cannot return before you depart please try your dates again`;
      }
    } catch (err) {
      console.log(err + "error");
    }
  } else {
    type = "history";
    let histStartDate = formatDate(startDate);
    let histEndDate = formatDate2(startDate);
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
      let { src, cityFound } = await getPicture(
        weatherInfo.city_name,
        weatherInfo.country_code
      );
      if (daysTillTrip <= daysTillTripEnds) {
        postData(
          weatherInfo,
          daysTillTrip,
          daysTillTripEnds,
          src,
          cityFound,
          type
        );
      } else {
        let errorText = document.getElementById("errorText");
        errorText.innerHTML = `Sorry! Buy you cannot return before you depart please try your dates again`;
      }
    } catch (err) {
      console.log(err + "error");
    }
  }
};

export { getWeather };
