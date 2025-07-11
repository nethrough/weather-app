// Import required modules for serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { city } = req.query;
    
    // Validate city parameter
    if (!city) {
      return res.status(400).json({ 
        error: 'City parameter is required' 
      });
    }

    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }

    // Make request to OpenWeatherMap API
    const response = await fetch(`${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`);
    
    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'API key is invalid or unauthorized' 
        });
      }
      
      if (response.status === 404) {
        return res.status(404).json({ 
          error: 'City not found. Please check the spelling and try again.' 
        });
      }
      
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.message || 'Error from weather service' 
      });
    }

    const weatherData = await response.json();
    res.json(weatherData);

  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.' 
    });
  }
}