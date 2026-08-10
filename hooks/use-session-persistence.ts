/**
 * Session persistence hook for AsyncStorage operations.
 *
 * Responsibilities:
 * - Load and persist last duration minutes
 * - Load and persist background alerts setting
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function useSessionPersistence(timerStarted: boolean) {
  const [input, setInput] = useState('5');
  const [allowBackgroundAlerts, setAllowBackgroundAlerts] = useState<boolean>(true);

  // Prefill input from last used duration and restore settings
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('lastDurationMinutes');
        if (stored && !timerStarted) {
          setInput(stored);
        }
        const savedAllowBg = await AsyncStorage.getItem('allowBackgroundAlerts');
        if (savedAllowBg === 'true' || savedAllowBg === 'false') {
          setAllowBackgroundAlerts(savedAllowBg === 'true');
        }
      } catch {
        // ignore storage errors
      }
    })();
  }, [timerStarted]);

  // Persist input when it changes (only when not started)
  useEffect(() => {
    if (!timerStarted) {
      AsyncStorage.setItem('lastDurationMinutes', input).catch(() => {});
    }
  }, [input, timerStarted]);

  // Persist allowBackgroundAlerts
  useEffect(() => {
    AsyncStorage.setItem('allowBackgroundAlerts', allowBackgroundAlerts ? 'true' : 'false').catch(() => {});
  }, [allowBackgroundAlerts]);

  const handleInput = useCallback((text: string) => {
    if (typeof text === 'string' && !Number.isNaN(Number(text))) {
      setInput(text);
    }
  }, []);

  return {
    input,
    setInput,
    allowBackgroundAlerts,
    setAllowBackgroundAlerts,
    handleInput,
  };
}
