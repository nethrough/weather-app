import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import BackgroundElements from './components/BackgroundElements';
import { fetchWeatherData } from './services/weatherService';
import styles from './styles/App.module.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');

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
    <>
      <BackgroundElements />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Weather Forecast</h1>
        </header>
        
        <main className={styles.main}>
          <SearchBar onSearch={handleSearch} />
          
          {loading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}
          
          {weatherData && !loading && !error && (
            <WeatherCard weatherData={weatherData} />
          )}
          
          {!weatherData && !loading && !error && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌙</div>
              <h2>Welcome to Weather Forecast</h2>
              <p>Search for any city to get current weather information</p>
            </div>
          )}
        </main>
        
        <footer className={styles.footer}>
          <p>Created with React & Node.js</p>
        </footer>
      </div>
    </>
  );
}

export default App;