import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (Platform.OS === 'web') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setReduceMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // For native platforms, default to false
    // In the future, this could be enhanced with expo-accessibility when available
    setReduceMotion(false);
  }, []);

  return reduceMotion;
}