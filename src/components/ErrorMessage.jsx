import styles from '../styles/ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.error}>
      <p className={styles.errorIcon}>⚠️</p>
      <p className={styles.errorText}>{message}</p>
    </div>
  );
};

export default ErrorMessage;