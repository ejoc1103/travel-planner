//Takes the city_name or country code and returns a random pic from the pixabay api

import countries from "i18n-iso-countries";
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const getPicture = async (city_name, country_code) => {
  let cityFound = true;
  city_name = city_name.split(" ");
  city_name = city_name.join("+");
  const res = await fetch("http://localhost:3000/picture");
  const data = await res.json();

  let picData = await fetch(data.key + city_name + data.end);
  let finalData = await picData.json();
  // checks if city name returns any pics
  if (!finalData.hits[0]) {
    cityFound = false;
    //gets us the country name based off the country code returned from the weather api
    let selector = countries.getName(`${country_code}`, "en", {
      select: "official",
    });
    selector = selector.split(" ");
    selector = selector.join("+");
    picData = await fetch(data.key + selector + data.end);
    finalData = await picData.json();
  }
  //randomizes the picture choice
  const picChoice = Math.floor(Math.random() * finalData.hits.length);
  const src = finalData.hits[picChoice].largeImageURL;
  return { src, cityFound };
};

export { getPicture };
