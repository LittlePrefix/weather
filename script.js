function getWeather() {
    var cityName = document.getElementById("cityInput").value;
    var apiKey = "30290f7d41ea9f53ed56565b95773556"; // Replace with your actual API key
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Bad Request');
            }
            return response.json();
        })
        .then(data => {
 
            if (data && data.main && data.main.temp) {
                var temperature = data.main.temp;
                document.getElementById("weatherInfo").innerHTML = `Current temperature in ${cityName}: ${temperature}°C`;
            } else {
                throw new Error('Invalid Data Format');
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error.message);
            document.getElementById("weatherInfo").innerHTML = 'Error fetching weather data. Please try again.';
        });

 
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(forecastApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Bad Request');
            }
            return response.json();
        })
        .then(data => {
        
            if (data && data.list && data.list.length > 0) {
            
                var threeDayForecast = data.list.slice(0, 8 * 3);

                
                displayForecast(threeDayForecast);
            } else {
                throw new Error('Invalid Forecast Data Format');
            }
        })
        .catch(error => {
            console.error('Error fetching three-day forecast data:', error.message);
        });
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}


function displayForecast(forecastData) {
    var forecastTable = document.getElementById("forecastTable");

    if (!forecastTable) {
        console.error('Forecast table not found.');
        return;
    }

    var tbody = document.getElementById("forecastData");
    tbody.innerHTML = '';

    var currentDay = '';

    forecastData.forEach(item => {
        var forecastTime = new Date(item.dt * 1000);
        var temperature = item.main.temp;
        var weatherDescription = item.weather[0].description;

        var row = tbody.insertRow();
        var dateCell = row.insertCell(0);
        var timeCell = row.insertCell(1);
        var tempCell = row.insertCell(2);
        var descCell = row.insertCell(3);

        var dayString = forecastTime.toLocaleDateString('en-US', { weekday: 'long' });

        
        if (dayString !== currentDay) {
            dateCell.textContent = dayString;
            currentDay = dayString;
        }

        timeCell.textContent = forecastTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        });
        tempCell.textContent = temperature.toFixed(2) + "°C";
        descCell.textContent = weatherDescription;
    });
}
