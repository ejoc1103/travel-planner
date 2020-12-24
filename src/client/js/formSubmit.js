function handleSubmit(event) {
  event.preventDefault();
  // trip start and end date from form submit
  const startDate = document.getElementById("date-departure").value;
  const endDate = document.getElementById("date-return").value;

  //length of trip in nanoseconds
  const tripTime = new Date(endDate) - new Date(startDate);
  //gets length of trip in days
  const lengthOfTrip = tripTime / (1000 * 60 * 60 * 24);
  console.log(lengthOfTrip + "length of the trip");

  //time till the trip starts in nanoseconds
  const timeTillTrip = new Date(startDate) - new Date();
  //time till trip in days
  const daysTillTrip = Math.floor(timeTillTrip / (1000 * 60 * 60 * 24));

  console.log(daysTillTrip + "time till trip starts");

  let formText = document.getElementById("city").value;
  console.log(formText);
  if (formText) {
    fetch("http://localhost:3000/city")
      .then((res) => res.json())
      .then((res) => {
        return getCity(res.baseUrl, res.key, res.mid, formText);
      })
      .then((res) => {
        console.log(res.geonames[0].lat + "     " + res.geonames[0].lng);
        fetch("http://localhost:3000/weather")
          .then((res) => res.json())
          .then((res) => {
            getWeather(
              res.key,
              res.baseUrl,
              res.mid,
              res.days,
              res.beforeKey,
              lengthOfTrip,
              res.geonames[0].lat,
              res.geonames[0].lng
            );
          });
      });
  }
}

const getCity = async (baseURL, key, mid, city) => {
  try {
    const res = await fetch(baseURL + city + mid + key);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err + "error");
  }
};

const getWeather = async (
  key,
  baseUrl,
  mid,
  days,
  beforeKey,
  lengthOfTrip,
  lat,
  lng
) => {
  try {
    const res = await fetch(
      baseUrl + lat + mid + lng + days + lengthOfTrip + beforeKey + key
    );
    const data = await res.json();
    setUI(data[0].high_temp);
  }
};

const setUI = (highTemp) => {
  document.getElementById("placeHolder").innerHTML = highTemp;
};

export { handleSubmit };
