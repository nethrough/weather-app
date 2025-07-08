import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import DarkModeToggle from './components/DarkModeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { fetchWeatherData } from './services/weatherService';
import { useDarkMode } from './hooks/useDarkMode';
import styles from './styles/App.module.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    // Apply dark mode class to body for global styling
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleSearch = async (searchCity) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name');
      return;
    }

    setCity(searchCity);
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await fetchWeatherData(searchCity);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weather Forecast</h1>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      
      <main className={styles.main}>
        <SearchBar onSearch={handleSearch} />
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {weatherData && !loading && !error && (
          <WeatherCard weatherData={weatherData} />
        )}
      </main>
      
      <footer className={styles.footer}>
        <p>Created with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;