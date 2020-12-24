function handleSubmit(event) {
  event.preventDefault();

  let formText = document.getElementById("city").value;
  console.log(formText);
  if (formText) {
    fetch("http://localhost:3000/city")
      .then((res) => res.json())
      .then(function (res) {
        getCity(res.baseUrl, res.key, res.mid, formText);
      });
  }
}

const getCity = async (baseURL, key, mid, city) => {
  try {
    const res = await fetch(baseURL + city + mid + key);
    const data = await res.json();
    console.log(data);
    setUI(data.geonames[0]);
  } catch (err) {
    console.log(err + "error");
  }
};

const setUI = ({ toponymName }) => {
  document.getElementById("placeHolder").innerHTML = toponymName;
};

export { handleSubmit };
