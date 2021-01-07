import { getWeather } from "./getWeather";
// after the geonames api is called this takes that information can calls the weatherbit api
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

export { getCity };
