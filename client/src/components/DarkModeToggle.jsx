import styles from '../styles/DarkModeToggle.module.css';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button 
      className={`${styles.toggle} ${isDarkMode ? styles.dark : styles.light}`}
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span>{isDarkMode ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default DarkModeToggle;