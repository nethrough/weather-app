const API_BASE_URL = import.meta.env.PROD 
  ? '/api/weather' 
  : 'http://localhost:3001/api/weather';

/**
 * Fetches weather data from the API based on city name
 * @param {string} city - The city name to search for
 * @returns {Promise<Object>} - Weather data object
 * @throws {Error} - If the API request fails
 */
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