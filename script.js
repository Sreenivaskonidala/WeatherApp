const apiKey = "0c4e18e7b1da25c64e97ff5fe482a03f";

function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Please enter a city');
        return;
    }
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    fetch(currentUrl)
        .then(res => {
            if (!res.ok) throw new Error('City not found');
            return res.json();
        })
        .then(data => displayWeather(data))
        .catch(err => {
            console.error('Error fetching current weather:', err);
            alert(err.message);
        });

    fetch(forecastUrl)
        .then(res => {
            if (!res.ok) throw new Error('Forecast not available');
            return res.json();
        })
        .then(data => displayHourlyForecast(data.list))
        .catch(err => {
            console.error('Error fetching forecast:', err);
        });
}

function displayWeather(data) {
    const tempDiv = document.querySelector('.temp-div');
    const infoDiv = document.querySelector('.weather-info');

    tempDiv.innerHTML = '';
    infoDiv.innerHTML = '';
    const cityName = document.createElement('h3');
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    const temp = document.createElement('p');
    temp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;

    const desc = document.createElement('p');
    desc.textContent = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.alt = data.weather[0].description;

    tempDiv.append(cityName, temp, icon);
    infoDiv.append(desc);
}

function displayHourlyForecast(list) {
    const forecastDiv = document.querySelector('.hourly-forecast');
    forecastDiv.innerHTML = ''; 
    list.slice(0, 8).forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.classList.add('forecast-slot');
        const dt = new Date(slot.dt * 1000);
        const hours = dt.getHours().toString().padStart(2, '0');
        const mins  = dt.getMinutes().toString().padStart(2, '0');
        const timeP = document.createElement('p');
        timeP.textContent = `${hours}:${mins}`;
        const tempP = document.createElement('p');
        tempP.innerHTML = `${Math.round(slot.main.temp)}&deg;C`;
        const iconImg = document.createElement('img');
        iconImg.src = `https://openweathermap.org/img/wn/${slot.weather[0].icon}.png`;
        iconImg.alt = slot.weather[0].description;
        slotEl.append(timeP, iconImg, tempP);
        forecastDiv.append(slotEl);
    });
}

document.getElementById('city').addEventListener('keyup', e => {
    if (e.key === 'Enter') getWeather();
});
