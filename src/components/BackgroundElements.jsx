import styles from '../styles/BackgroundElements.module.css';

const BackgroundElements = () => {
  return (
    <div className={styles.backgroundContainer}>
      {/* Animated weather icons */}
      <div className={`${styles.weatherIcon} ${styles.icon1}`}>🌙</div>
      <div className={`${styles.weatherIcon} ${styles.icon2}`}>⭐</div>
      <div className={`${styles.weatherIcon} ${styles.icon3}`}>☁️</div>
      <div className={`${styles.weatherIcon} ${styles.icon4}`}>✨</div>
      <div className={`${styles.weatherIcon} ${styles.icon5}`}>🌟</div>
      
      {/* Animated shapes */}
      <div className={`${styles.shape} ${styles.shape1}`}></div>
      <div className={`${styles.shape} ${styles.shape2}`}></div>
      <div className={`${styles.shape} ${styles.shape3}`}></div>
      
      {/* Animated particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}></div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundElements;