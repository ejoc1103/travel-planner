//Adds all the info to the UI after all the api's have been called and eror checked

const buildUI = (tripInfo) => {
  //sorts the trips by the departure date
  tripInfo.sort(function (a, b) {
    return b.daysTillTrip - a.daysTillTrip;
  });

  // a sort feature I couldn't quire get working
  // let tripInfo = unsortedTripInfo.filter((trip) => trip.daysTillTripEnds >= 0);

  // unsortedTripInfo.map((trip, index) => {
  //   console.log("Map?");
  //   let sort;
  //   if (trip.daysTillTripEnds <= 0) {
  //     console.log("If");
  //     sort = unsortedTripInfo.slice(index, 1);
  //     tripInfo.push(sort[0]);
  //   }
  // });

  //erases error text if it's up from a previous failed trip
  let errorText = document.getElementById("errorText");
  errorText.innerHTML = "";
  const container = document.getElementById("tripContainer");
  container.innerHTML = "";
  tripInfo.map((trip) => {
    //sets variables for the time till trip and length of trip
    let weeks = Math.floor(trip.daysTillTrip / 7);
    let days = trip.daysTillTrip % 7;
    let length = trip.daysTillTripEnds - trip.daysTillTrip + 1;
    const eachTripContainer = document.createElement("div");
    eachTripContainer.className = "eachTrip";

    const tripHeader = document.createElement("div");
    tripHeader.className = "tripHeader";
    const cityNameDiv = document.createElement("div");
    cityNameDiv.className = "cityNameDiv";

    const cityName = document.createElement("h1");

    // sets the capiton based on when the trip is happening
    if (trip.daysTillTrip < 0 && trip.daysTillTripEnds < 0) {
      cityName.innerHTML = `This trip to ${trip.city_name} has passed! Hope you had a good time!`;
    } else if (trip.daysTillTrip < 0 && trip.daysTillTripEnds > 0) {
      cityName.innerHTML = `You're already on this ${length} day trip to ${trip.city_name}! Hope you're having fun!`;
    } else {
      cityName.innerHTML = `There are ${weeks} weeks and ${days} days left until your trip to ${trip.city_name}!!!  You are going for ${length} days`;
    }
    cityName.className = "cityName";

    const figure = document.createElement("figure");
    const figCaption = document.createElement("figcaption");
    // Needed when there's no pics of the city traveled to.  Pulling pics from the country can bring up some random stuff
    if (!trip.cityFound) {
      figCaption.innerHTML =
        "Sorry we don't have a picture of this city.  Here is a picture from the Country it is in.";
    }

    const cityImg = document.createElement("img");
    cityImg.src = trip.src;
    cityImg.alt = "Trip Picture";
    cityImg.className = "cityImg";

    figure.appendChild(cityImg);
    figure.appendChild(figCaption);
    // creates the remove button and puts an onclick filter function to delete a trip
    const removeButton = document.createElement("button");
    removeButton.className = "removeButton";
    removeButton.innerHTML = "remove trip";
    removeButton.value = `${trip.id}`;
    removeButton.addEventListener("click", async function (event) {
      const res = await fetch("http://localhost:3000/all");
      const uiData = await res.json();

      const filtData = uiData.filter((ui) => ui.id !== event.target.value);

      const response = await fetch("http://localhost:3000/remove", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filtData),
      });
      try {
        const newData = await response.json();
        buildUI(newData);
      } catch (error) {
        console.log("error in post", error);
      }
    });

    cityNameDiv.appendChild(cityName);
    cityNameDiv.appendChild(removeButton);
    //When you plan a one day trip api doesnt return an array this just makes it an array to make it easier to work with
    if (!Array.isArray(trip.weather)) {
      trip.weather = [trip.weather];
    }
    trip.weather.map((day) => {
      const weatherContainer = document.createElement("div");
      weatherContainer.className = "weatherContainer";

      const dateIcon = document.createElement("div");
      dateIcon.className = "dateIcon";

      const histDateDesc = document.createElement("div");
      histDateDesc.className = "histDateDesc";

      const descContainer = document.createElement("div");
      descContainer.className = "descContainer";

      const descHistContainer = document.createElement("div");
      descHistContainer.className = "descHistContainer";
      //This conditional seperates the logic for a forecast vs historic weather UI
      if (trip.type === "forecast") {
        let currentDate = new Date(day.datetime);
        let currentDay = currentDate.getDay();
        let days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const icon = document.createElement("img");
        icon.src = `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`;
        icon.alt = "weather icon";
        icon.className = "icon";
        const dayName = document.createElement("h2");
        dayName.innerHTML = `${days[currentDay]}`;
        const date = document.createElement("h2");
        date.innerHTML = `${day.datetime}`;

        const desc = document.createElement("h2");
        desc.innerHTML = day.weather.description;

        const temp = document.createElement("h6");
        temp.innerHTML = `High: ${day.max_temp}&deg Low: ${day.low_temp}&deg`;

        const rain = document.createElement("h6");
        rain.innerHTML = `Chance of rain is ${day.pop}%`;

        const cloud = document.createElement("h6");
        cloud.innerHTML = `Cloud coverage ${day.clouds}%`;

        const uv = document.createElement("h6");
        uv.innerHTML = `UV index is a ${Math.round(day.uv * 10) / 10}`;

        dateIcon.insertAdjacentElement("beforeend", dayName);
        dateIcon.insertAdjacentElement("beforeend", date);
        dateIcon.insertAdjacentElement("beforeend", icon);
        dateIcon.insertAdjacentElement("beforeend", desc);
        descContainer.insertAdjacentElement("beforeend", temp);
        descContainer.insertAdjacentElement("beforeend", rain);
        descContainer.insertAdjacentElement("beforeend", cloud);
        descContainer.insertAdjacentElement("beforeend", uv);
        weatherContainer.insertAdjacentElement("beforeend", dateIcon);
        weatherContainer.insertAdjacentElement("beforeend", descContainer);

        eachTripContainer.insertAdjacentElement("beforeend", weatherContainer);
      } else {
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let month = day.datetime.split("-")[1];
        month = parseInt(month) - 1;
        weatherContainer.style.gridColumn = "1/-1";
        const dateDesc = document.createElement("h2");
        dateDesc.innerHTML = `Recent past weather for ${months[month]}:`;

        const temp = document.createElement("h6");
        temp.innerHTML = `High: ${day.max_temp}&deg Low: ${day.min_temp}&deg`;

        const rain = document.createElement("h6");
        rain.innerHTML = `${day.precip} inches of rain`;

        const clouds = document.createElement("h6");
        clouds.innerHTML = `${day.clouds}% cloud coverage`;

        const wind = document.createElement("h6");
        wind.innderHTML = `${day.wind_speed} mph wind speed`;

        const snow = document.createElement("h6");
        snow.innerHTML = `${day.snow} inches of snow`;

        histDateDesc.insertAdjacentElement("beforeend", dateDesc);
        descHistContainer.insertAdjacentElement("beforeend", temp);
        descHistContainer.insertAdjacentElement("beforeend", rain);
        descHistContainer.insertAdjacentElement("beforeend", clouds);
        descHistContainer.insertAdjacentElement("beforeend", wind);
        descHistContainer.insertAdjacentElement("beforeend", snow);
        weatherContainer.insertAdjacentElement("beforeend", histDateDesc);
        weatherContainer.insertAdjacentElement("beforeend", descHistContainer);
        eachTripContainer.insertAdjacentElement("beforeend", weatherContainer);
      }

      tripHeader.insertAdjacentElement("beforeend", figure);
      tripHeader.insertAdjacentElement("beforeend", cityNameDiv);
      eachTripContainer.insertAdjacentElement("afterbegin", tripHeader);
      container.insertAdjacentElement("afterbegin", eachTripContainer);
    });
  });
};

export { buildUI };
