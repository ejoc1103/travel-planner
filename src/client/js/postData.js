import uniqid from "uniqid";
import { buildUI } from "./buildUI";
//Posts the data to the server to be saved temporarily in an array
const postData = async (
  data,
  daysTillTrip,
  daysTillTripEnds,
  src,
  cityFound,
  type
) => {
  let days = [];
  let daily = data.data;
  let tripDays = [];
  if (type === "forecast") {
    //checks whether the trip is one day or longer
    if (daysTillTrip !== daysTillTripEnds) {
      //Builds an array of the days you will be on the trip out of the 16 days available from the weather forecast
      for (let i = daysTillTrip + 1; i <= daysTillTripEnds + 1; i++) {
        days.push(i);
      }
      //filters out the days from the 16 day weather forecast we don't need
      tripDays = daily.filter((day, index) => days.includes(index));
    } else {
      tripDays = daily[daysTillTrip];
    }
  }
  //if type = history we only need one day
  if (type === "history") {
    tripDays = data.data;
  }
  let dataObj = {
    id: uniqid(),
    city_name: data.city_name,
    timezone: data.timezone,
    weather: tripDays,
    daysTillTrip,
    daysTillTripEnds,
    src,
    cityFound,
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

export { postData };
