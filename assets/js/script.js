function initPage() {
  // DOM element references
  var elementInput = document.getElementById("city-input");
  var searchElement = document.getElementById("search-button");
  var clearElement = document.getElementById("clear-history");
  var nameElement = document.getElementById("city-name");
  var currentPicElement = document.getElementById("current-pic");
  var currentTempElement = document.getElementById("temperature");
  var currentHumidityElement = document.getElementById("humidity");
  4;
  var currentWindElement = document.getElementById("wind-speed");
  var currentUVElement = document.getElementById("UV-index");
  var historyElement = document.getElementById("history");
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  console.log(searchHistory);

  var APIKey = "c9a9ed03a355403f4cb9a36e931c0b4a";

  function getWeather(cityName) {
    //  execute a current condition get request from open weather map api
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    axios.get(queryURL).then(function (response) {
      console.log(response);
      //  Parse response to display current conditions

      var currentDate = new Date(response.data.dt * 1000);
      console.log(currentDate);
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      nameElement.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      var weatherPic = response.data.weather[0].icon;
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
      var lat = response.data.coord.lat;
      var lon = response.data.coord.lon;
      var UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        var UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVElement.innerHTML = "UV Index: ";
        currentUVElement.append(UVIndex);
      });
      //  execute a five day forecast requested from open weather map api
      var cityID = response.data.id;
      var forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        // display five day forecast.
        console.log(response);
        var forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          var forecastIndex = i * 8 + 4;
          var forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          var forecastDay = forecastDate.getDate();
          var forecastMonth = forecastDate.getMonth() + 1;
          var forecastYear = forecastDate.getFullYear();
          var forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          var forecastWeatherEl = document.createElement("img");
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
          var forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          var forecastHumidityEl = document.createElement("p");
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
    var searchTerm = elementInput.value;
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
    for (var i = 0; i < searchHistory.length; i++) {
      var btn = document.createElement("input");

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
