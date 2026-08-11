/**
 * Session app state hook for monitoring app active state.
 *
 * Responsibilities:
 * - Track app active state to avoid firing alerts during backgrounding
 * - Provide ref for checking app state during operations
 */
import { AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';

export function useSessionAppState() {
  const appIsActiveRef = useRef(true);

  useEffect(() => {
    const onChange = (s: AppStateStatus) => {
      appIsActiveRef.current = s === 'active';
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  return appIsActiveRef;
}
