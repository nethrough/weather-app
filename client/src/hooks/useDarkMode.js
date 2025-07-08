import { useState, useEffect } from 'react';

/**
 * Custom hook to handle dark mode toggle with local storage persistence
 * @returns {[boolean, Function]} - Dark mode state and toggle function
 */
export const useDarkMode = () => {
  // Check if user previously set dark mode preference
  const storedDarkMode = localStorage.getItem('darkMode');
  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode !== null ? JSON.parse(storedDarkMode) : 
    // Check system preference as fallback
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Add listener for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Add event listener (using the appropriate method based on browser support)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Toggle function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
};