// File: src/components/WeatherCard.jsx
import { useEffect, useState } from 'react';
import styles from '../styles/WeatherCard.module.css';

const WeatherCard = ({ weatherData }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Extract required weather information
  const {
    name,
    main: { temp, humidity },
    weather,
    wind: { speed },
    sys: { country }
  } = weatherData;

  const weatherIcon = weather[0].icon;
  const description = weather[0].description;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  // The API is already returning Celsius because we set units=metric in the backend
  // So we just need to round the temperature, not convert it
  const celsiusTemp = Math.round(temp);

  return (
    <div className={`${styles.card} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.location}>
        <h2>{name}, {country}</h2>
      </div>
      
      <div className={styles.weatherMain}>
        <img 
          src={iconUrl} 
          alt={description} 
          className={styles.weatherIcon} 
        />
        <div className={styles.temperature}>
          <span className={styles.tempValue}>{celsiusTemp}°C</span>
        </div>
      </div>
      
      <div className={styles.weatherDescription}>
        <p>{description.charAt(0).toUpperCase() + description.slice(1)}</p>
      </div>
      
      <div className={styles.weatherDetails}>
        <div className={styles.detail}>
          <span className={styles.label}>Humidity</span>
          <span className={styles.value}>{humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Wind</span>
          <span className={styles.value}>{speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;