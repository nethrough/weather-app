const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// API key configuration and validation
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Debug: Check if API key is loaded
console.log('API Key loaded:', WEATHER_API_KEY ? `Yes (length: ${WEATHER_API_KEY.length})` : 'No');
console.log('First 5 characters of API key:', WEATHER_API_KEY ? WEATHER_API_KEY.substring(0, 5) : 'N/A');

// Validate environment variables
if (!WEATHER_API_KEY) {
  console.error('WEATHER_API_KEY environment variable is not set!');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Adds security headers

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  message: 'Too many requests, please try again later.'
});

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

/**
 * Weather API endpoint
 * GET /api/weather?city=CityName
 */
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    // Validate city parameter
    if (!city) {
      return res.status(400).json({ 
        error: 'City parameter is required' 
      });
    }

    console.log(`Making request to OpenWeatherMap for city: ${city}`);
    console.log(`Request URL: ${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY.substring(0, 5)}...&units=metric`);

    // Make request to OpenWeatherMap API
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric' // Adding units parameter often helps with authentication
      }
    });

    console.log('OpenWeatherMap response status:', response.status);
    
    // Return weather data
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', error.message);
    
    // Log the full error response if available
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data));
    }
    
    // Handle API-specific errors
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        return res.status(401).json({ 
          error: 'API key is invalid or unauthorized. Please check your OpenWeatherMap API key.' 
        });
      }
      
      if (status === 404) {
        return res.status(404).json({ 
          error: 'City not found. Please check the spelling and try again.' 
        });
      }
      
      if (status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        });
      }
      
      return res.status(status).json({ 
        error: `Error from weather service: ${error.response.data.message || 'Unknown error'}` 
      });
    }
    
    // Handle network errors
    res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  // Also display API key status on health check (remove in production)
  res.status(200).json({ 
    status: 'ok',
    apiKeyConfigured: !!WEATHER_API_KEY,
    apiKeyLength: WEATHER_API_KEY ? WEATHER_API_KEY.length : 0
  });
});

// Test endpoint for direct API key validation
app.get('/api/test', async (req, res) => {
  try {
    console.log('Testing API key with a direct request to OpenWeatherMap');
    const testCity = 'london';
    
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: testCity,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    res.json({
      success: true,
      message: 'API key is valid and working correctly',
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API key validation failed',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Assuming the frontend build is in the 'dist' directory
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`API test endpoint available at: http://localhost:${PORT}/api/test`);
});