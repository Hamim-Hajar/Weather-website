const dailyForcastContainer = document.querySelector(".dailyForcastContainer");
const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("search");
const cities = ["Tanger", "Rabat", "Fes", "Livry"];

searchButton.addEventListener("click", async function () {
  const city = searchBox.value;
  try {
    await getWeather(city);
    await getWeatherForecast(city);
  } catch (error) {
    console.log("Error:", error);
    showAlert("Invalid Location!");
  }
});

async function getWeather(city) {
    const apiKey = "6d39e508639c6655543ed58252a5f44c";
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(urlCurrent);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const weatherInfo = {
        currentTemperature: Math.round(data.main.temp),
        precipitation: "N/A",
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        conditionText: data.weather[0].description,
        conditionIcon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        dayOfWeekStr: formatDayOfWeek(new Date(data.dt * 1000)),
      };
      showDailyForcastDetails(weatherInfo, city);
    } catch (error) {
      console.log(`There was a problem with fetch operation: ${error.message}`);
      throw error;
    }
  }

  async function getWeatherForecast(city) {
    const apiKey = "6d39e508639c6655543ed58252a5f44c";
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    dailyForcastContainer.innerHTML = "";
  
    try {
      const response = await fetch(urlForecast);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.list.forEach((forecast) => {
        const weatherInfo = {
          currentTemperature: Math.round(forecast.main.temp),
          conditionIcon: `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`,
          precipitation: "N/A",
          windSpeed: forecast.wind.speed,
          humidity: forecast.main.humidity,
          conditionText: forecast.weather[0].description,
          minTemp: Math.round(forecast.main.temp_min),
          maxTemp: Math.round(forecast.main.temp_max),
          dayOfWeekStr: formatDayOfWeek(new Date(forecast.dt * 1000)),
        };
        const dailyForcastHtml = generateDailyForcastHTML(weatherInfo, city);
        dailyForcastContainer.appendChild(dailyForcastHtml);
      });
    } catch (error) {
      console.log(`There was a problem with the fetch operation: ${error.message}`);
      throw error;
    }
  }
  
  function formatDayOfWeek(dateTimeString) {
    const date = new Date(dateTimeString);
    const hour = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    const dayOfWeekNum = date.getDay();
    const daysOfWeekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayOfWeekStr = daysOfWeekArray[dayOfWeekNum];
    dayOfWeekStr += " " + hour + ":" + minute;
    return dayOfWeekStr;
  }

  function generateDailyForcastHTML(weatherInfo, city) {
    const div = document.createElement("div");
    div.className = "dailyForcast";
  
    const weekdayDiv = document.createElement("div");
    weekdayDiv.className = "weekday";
    weekdayDiv.textContent = weatherInfo.dayOfWeekStr.substring(0, 3);
    div.appendChild(weekdayDiv);
  
    const imageDiv = document.createElement("div");
    const img = document.createElement("img");
    img.id = "currentIcon";
    img.src = weatherInfo.conditionIcon;
    imageDiv.appendChild(img);
    div.appendChild(imageDiv);
  
    const maxMinTempDiv = document.createElement("div");
    maxMinTempDiv.className = "maxMinTemp";
  
    const tempSpan1 = document.createElement("span");
    tempSpan1.className = "temp";
    tempSpan1.textContent = weatherInfo.maxTemp + "°";
    maxMinTempDiv.appendChild(tempSpan1);
    const tempSpan2 = document.createElement("span");
    tempSpan2.className = "temp";
    tempSpan2.textContent = weatherInfo.minTemp + "°";
    maxMinTempDiv.appendChild(tempSpan2);
  
    div.appendChild(maxMinTempDiv);
    div.addEventListener("click", function () {
      showDailyForcastDetails(weatherInfo, city);
    });
    return div;
  }

  function showDailyForcastDetails(weatherInfo, city) {
    dayTemperature.innerHTML = weatherInfo.currentTemperature;
    precipitation.innerHTML = weatherInfo.precipitation;
    humidity.innerHTML = weatherInfo.humidity + "%";
    wind.innerHTML = weatherInfo.windSpeed + " kph";
    condition.innerHTML = weatherInfo.conditionText;
    today.innerHTML = weatherInfo.dayOfWeekStr;
    cityName.innerHTML = city;
    document.getElementById("currentIcon").src = weatherInfo.conditionIcon;
  }
  function showAlert(message) {
    const alert = document.getElementById("alert");
    alert.innerHTML = message;
    alert.style.display = "flex";
  
    setTimeout(function () {
      alert.style.display = "none";
    }, 1000);
  }
  /********************************** */
  async function getWeatherData(city) {
    const apiKey = "6d39e508639c6655543ed58252a5f44c";
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
function displayWeather(city, data) {
  const weatherContainer = document.getElementById('weather-container');
  const weatherCard = document.createElement('div');
  weatherCard.classList.add('weather-card');

  const locationElement = document.createElement('div');
  locationElement.classList.add('location');
  locationElement.textContent = data.name;

  const temperatureElement = document.createElement('div');
  temperatureElement.textContent = `Temperature: ${data.main.temp} °C`;

  const conditionsElement = document.createElement('div');
  conditionsElement.textContent = `Conditions: ${data.weather[0].description}`;

  const imageElement = document.createElement('img');
  const iconCode = data.weather[0].icon;
  const imageUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  imageElement.src = imageUrl;

  const humidityElement = document.createElement('div');
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

  const windSpeedElement = document.createElement('div');
  windSpeedElement.textContent = `Wind speed: ${data.wind.speed} m/s`;

  weatherCard.appendChild(locationElement);
  weatherCard.appendChild(imageElement);
  weatherCard.appendChild(temperatureElement);
  weatherCard.appendChild(conditionsElement);
  weatherCard.appendChild(humidityElement);
  weatherCard.appendChild(windSpeedElement);

  weatherContainer.appendChild(weatherCard);
}


// Fonction principale pour obtenir et afficher les données météorologiques de chaque ville
async function fetchAndDisplayWeather() {
    for (const city of cities) {
        const data = await getWeatherData(city);
        displayWeather(city, data);
        console.log(data);
    }
}

// Appel de la fonction pour obtenir et afficher les données météorologiques
fetchAndDisplayWeather();