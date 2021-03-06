import { getCity } from "./getCity";
import { buildUI } from "./buildUI";
const dayConvert = 1000 * 60 * 60 * 24;

//Makes sure that the page loads the data from the server if you navigate away from the page after
//navigating away from the page or refreshing
window.addEventListener("load", async function () {
  console.log("Working?");
  const res = await fetch("http://localhost:3000/all");
  const data = await res.json();
  console.log(data);
  try {
    buildUI(data);
  } catch (error) {
    console.log("error in post", error);
  }
});

function handleSubmit(event) {
  event.preventDefault();

  const currentDate = new Date();

  // trip start and end date from form submit
  let startDate = document.getElementById("date-departure").value;
  let endDate = document.getElementById("date-return").value;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 1);

  //time till the trip starts in nanoseconds
  const timeTillTrip = new Date(startDate) - currentDate;

  //time till trip starts in days
  const daysTillTrip = Math.floor(timeTillTrip / dayConvert);
  //time till the trip ends in nanoseconds
  const timeTillTripEnds = new Date(endDate) - currentDate;
  //conver to days
  const daysTillTripEnds = Math.floor(timeTillTripEnds / dayConvert);

  let formText = document.getElementById("city").value;
  //as long as the form has been submitted properly this will call the server
  //for what it needs to call geonames api
  if (formText) {
    //calls the server for api key and other info needed for api call
    fetch("http://localhost:3000/city")
      .then((res) => res.json())
      .then((res) => {
        //calls the function for calling the geonames api
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

export { handleSubmit };
