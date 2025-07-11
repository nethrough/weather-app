import { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        aria-label="City name"
      />
      <button className={styles.searchButton} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;