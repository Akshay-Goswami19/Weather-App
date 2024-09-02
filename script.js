const userTab = document.querySelector("[user-tab]");
const searchTab = document.querySelector("[search-tab]");
const WeatherContainer = document.querySelector("[weather-container]");
const grantLocationContainer = document.querySelector("[grant-location-container]");
const searchForm = document.querySelector("[search-form]");
const loadingContainer = document.querySelector("[loading-container]");
const userWeatherInfo = document.querySelector("[weather-info]");
const grantAccessBtn = document.querySelector("[grant-Access]");
const cityNotFound = document.querySelector("[not-found-container]");

let currentTab = userTab;
currentTab.classList.add("current-tab");

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantLocationContainer.classList.remove("active");
  cityNotFound.classList.remove("active");
  loadingContainer.classList.add("active");
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric`
    );

    let data = await response.json();
    loadingContainer.classList.remove("active");
    userWeatherInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingContainer.classList.remove("active");
    console.log("Error found:", error);
  }
}

function renderWeatherInfo(weatherInfo) {
  const city = document.querySelector("[city]");
  const countryIcon = document.querySelector("[country]");
  const desc = document.querySelector("[desc]");
  const weatherIcon = document.querySelector("[weather-icon]");
  const temp = document.querySelector("[temp]");
  const windspeed = document.querySelector("[windspeed]");
  const humidity = document.querySelector("[humidity]");
  const cloudiness = document.querySelector("[cloudiness]");

  city.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp + " °C";
  windspeed.innerText = weatherInfo?.wind?.speed + " m/s";
  humidity.innerText = weatherInfo?.main?.humidity + "%";
  cloudiness.innerText = weatherInfo?.clouds?.all + "%";
}

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("search-active")) {
      grantLocationContainer.classList.remove("active");
      userWeatherInfo.classList.remove("active");
      searchForm.classList.add("search-active");
    } else {
      searchForm.classList.remove("search-active");
      searchForm.classList.add("search-form");
      userWeatherInfo.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getFromSessionStorage() {
  let localCoordinates = sessionStorage.getItem("user-Coordinates");
  if (!localCoordinates) {
    grantLocationContainer.classList.add("active");
  } else {
    let coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

getFromSessionStorage();

grantAccessBtn.addEventListener("click", getUserLocation);

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported.");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-Coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[search-input]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = searchInput.value;
  if (city === "") return;
  else {
    fetchSearchWeather(city);
  }
});

async function fetchSearchWeather(city) {
  console.log(city);
  loadingContainer.classList.add("active");
  userWeatherInfo.classList.remove("active");
  grantLocationContainer.classList.remove("active");

  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric`
  );

  let data = await response.json();
  if (data?.cod == "404") {
    loadingContainer.classList.remove("active");
    cityNotFound.classList.add("active");
  } else {
    loadingContainer.classList.remove("active");
    cityNotFound.classList.remove("active");
    userWeatherInfo.classList.add("active");
    renderWeatherInfo(data);
  }
}
