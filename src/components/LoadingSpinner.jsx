import styles from '../styles/LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;