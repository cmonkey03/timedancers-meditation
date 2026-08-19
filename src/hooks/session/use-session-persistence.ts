/**
 * Session persistence hook for AsyncStorage operations.
 *
 * Responsibilities:
 * - Load and persist last duration minutes
 * - Load and persist background alerts setting
 */
import { settingsService } from '@/services/settings';
import { useCallback, useEffect, useState } from 'react';

export function useSessionPersistence(timerStarted: boolean) {
  const [input, setInput] = useState('10');
  const [allowBackgroundAlerts, setAllowBackgroundAlerts] = useState<boolean>(true);

  // Prefill input from last used duration and restore settings
  useEffect(() => {
    (async () => {
      try {
        const stored = await settingsService.getLastDurationMinutes();
        if (stored && !timerStarted) {
          setInput(stored);
        }
        const savedAllowBg = await settingsService.getAllowBackgroundAlerts();
        setAllowBackgroundAlerts(savedAllowBg);
      } catch {
        // ignore storage errors
      }
    })();
  }, [timerStarted]);

  // Persist input when it changes (only when not started)
  useEffect(() => {
    if (!timerStarted) {
      settingsService.setLastDurationMinutes(input);
    }
  }, [input, timerStarted]);

  // Persist allowBackgroundAlerts
  useEffect(() => {
    settingsService.setAllowBackgroundAlerts(allowBackgroundAlerts);
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
