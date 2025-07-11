// Use relative path for Vercel deployment
const API_BASE_URL = '/api/weather';

export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}?city=${encodeURIComponent(city)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};