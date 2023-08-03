const API_KEY = "c21b5f60d83a2009e8dee87d8ec5aab5";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const historyList = document.getElementById("historyList");
const weatherInfo = document.getElementById("weatherInfo");


document.addEventListener("DOMContentLoaded", () => {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeatherData(city);
            cityInput.value = "";
        }
    });
});

historyList.addEventListener("click", (e) => {
        const selectedCityElement = e.target.closest("li");
        if (selectedCityElement) {
        const selectedCity = selectedCityElement.textContent;
        getWeatherData(selectedCity);
    }
});

function getWeatherData(city) {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              displayWeatherData(city, data);
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
            });
        } else {
          console.error("City not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
      });
}

function displayWeatherData(city, data) {
      weatherInfo.innerHTML = "";
      const weatherCard = createWeatherCard(city, data);
      weatherInfo.appendChild(weatherCard);
      addHistoryItem(city);
}



function createWeatherCard(city, data) {
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");

    const cityName = document.createElement("h3");
    cityName.textContent = city;
    weatherCard.appendChild(cityName);
    cityName.className = "city-title"

    const currentWeather = data.list[0];
    const currentDate = new Date(currentWeather.dt * 1000);
    const currentWeatherContainer = createWeatherContainer(
      currentWeather,
      currentDate
    );
    weatherCard.appendChild(currentWeatherContainer);

    const forecastList = data.list.slice(1, 6);
    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const forecastContainer = createWeatherContainer(forecast, date);
      weatherCard.appendChild(forecastContainer);
    });

    return weatherCard;
}

function createWeatherContainer(data, date) {
    const container = document.createElement("div");
    container.classList.add("weather-container");

    const dateElement = document.createElement("p");
    dateElement.textContent = date.toLocaleDateString();
    container.appendChild(dateElement);

    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const iconElement = document.createElement("img");
    iconElement.src = iconUrl;
    container.appendChild(iconElement);

    const temperature = data.main.temp;
    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${temperature} °C`;
    container.appendChild(temperatureElement);

    const humidity = data.main.humidity;
    const humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${humidity} %`;
    container.appendChild(humidityElement);

    const windSpeed = data.wind.speed;
    const windSpeedElement = document.createElement("p");
    windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;
    container.appendChild(windSpeedElement);

    return container;
}

function addHistoryItem(city) {
      // Check if the city is already in the history list
      const existingCity = Array.from(historyList.children).find(
        (item) => item.textContent === city
      );

      if (!existingCity) {
        const li = document.createElement("li");
        li.textContent = city;
        historyList.appendChild(li);
      }
}


