function initPage() {
    const city = document.getElementById("enter-city");
    const search = document.getElementById("search-button");
    const clear = document.getElementById("clear-history");
    const name = document.getElementById("city-name");
    const currentPic = document.getElementById("current-pic");
    const currentTemp = document.getElementById("temperature");
    const currentHumidity = document.getElementById("humidity");
    const currentWind = document.getElementById("wind-speed");
    const history = document.getElementById("history");
    var fivedayForcast = document.getElementById("fiveday-header");
    var todayweather = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "d431122b6d39216f9efc5dc180c98399";

    function getWeather(cityName) {
        
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                todayweather.classList.remove("d-none");

                
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPic.setAttribute("alt", response.data.weather[0].description);
                currentTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
           
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayForcast.classList.remove("d-none");
                        
                        
                        const forecast = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecast.length; i++) {
                            forecast[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDate2 = document.createElement("p");
                            forecastDate2.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDate2.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecast[i].append(forecastDate);

                           
                            const forecastWeather = document.createElement("img");
                            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecast[i].append(forecastWeather);
                            const forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecast[i].append(forecastTemp);
                            const forecastHumidity = document.createElement("p");
                            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecast[i].append(forecastHumidity);
                        }
                    })
            });
    }

    
    search.addEventListener("click", function () {
        const searchTerm = city.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

   
    clear.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        history.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

initPage();