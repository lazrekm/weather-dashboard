function initPage() {
  // DOM element references
  const elementInput = document.getElementById("city-input");
  const searchElement = document.getElementById("search-button");
  const clearElement = document.getElementById("clear-history");
  const nameElement = document.getElementById("city-name");
  const currentPicElement = document.getElementById("current-pic");
  const currentTempElement = document.getElementById("temperature");
  const currentHumidityElement = document.getElementById("humidity");
  4;
  const currentWindElement = document.getElementById("wind-speed");
  const currentUVElement = document.getElementById("UV-index");
  const historyElement = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  console.log(searchHistory);

  const APIKey = "c9a9ed03a355403f4cb9a36e931c0b4a";

  function getWeather(cityName) {
    //  execute a current condition get request from open weather map api
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    axios.get(queryURL).then(function (response) {
      console.log(response);
      //  Parse response to display current conditions

      const currentDate = new Date(response.data.dt * 1000);
      console.log(currentDate);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameElement.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = response.data.weather[0].icon;
      currentPicElement.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      currentPicElement.setAttribute(
        "alt",
        response.data.weather[0].description
      );
      currentTempElement.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidityElement.innerHTML =
        "Humidity: " + response.data.main.humidity + "%";
      currentWindElement.innerHTML =
        "Wind Speed: " + response.data.wind.speed + " MPH";
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        const UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVElement.innerHTML = "UV Index: ";
        currentUVElement.append(UVIndex);
      });
      //  execute a five day forecast requested from open weather map api
      let cityID = response.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        // display five day forecast.
        console.log(response);
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          const forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            response.data.list[forecastIndex].weather[0].description
          );
          forecastEls[i].append(forecastWeatherEl);
          const forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          const forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " +
            response.data.list[forecastIndex].main.humidity +
            "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }

  searchElement.addEventListener("click", function () {
    const searchTerm = elementInput.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  });

  clearElement.addEventListener("click", function () {
    searchHistory = [];
    renderSearchHistory();
  });

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  // display the search history list.
  function renderSearchHistory() {
    historyElement.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const btn = document.createElement("input");

      btn.setAttribute("type", "text");
      btn.setAttribute("readonly", true);
      btn.setAttribute("class", "form-control d-block bg-white");
      // allows access to city name when click handler is invoked
      btn.setAttribute("value", searchHistory[i]);
      btn.addEventListener("click", function () {
        getWeather(btn.value);
      });
      historyElement.append(btn);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
}
initPage();
