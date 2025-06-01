const axios = require("axios");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/forecast";

async function getWeather(location) {
    console.log(OPENWEATHER_API_KEY);
  try {
    // Step 1: Geocode location (e.g., "Ludhiana, Punjab")
    const geoResponse = await axios.get(GEOCODING_URL, {
      params: {
        q: location,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lon } = geoResponse.data[0];

    // Step 2: Fetch weather forecast
    const weatherResponse = await axios.get(WEATHER_URL, {
      params: {
        lat,
        lon,
        units: "metric", // Celsius
        appid: OPENWEATHER_API_KEY,
      },
    });

    const data = weatherResponse.data;

    // Step 3: Format current weather
    const current = data.list[0];
    const conditionMap = {
      Clear: "sunny",
      Clouds: "cloudy",
      Rain: "rainy",
      Drizzle: "rainy",
      Thunderstorm: "stormy",
      Snow: "snowy",
      Mist: "foggy",
      Fog: "foggy",
    };

    // Step 4: Format 5-day forecast (one data point per day)
    const forecast = [];
    const days = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      if (!days[dayName] && forecast.length < 5) {
        days[dayName] = true;
        forecast.push({
          day:
            dayName ===
            new Date().toLocaleDateString("en-US", { weekday: "short" })
              ? "Today"
              : dayName,
          temp: `${Math.round(item.main.temp)}°C`,
          icon:
            conditionMap[item.weather[0].main] === "sunny" ? "sun" : "cloud",
        });
      }
    });

    return {
      temperature: Math.round(current.main.temp),
      condition: conditionMap[current.weather[0].main] || "cloudy",
      forecast,
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    
    throw new Error("Failed to fetch weather data");
  }
}

module.exports = { getWeather };
