/**
 * Screen lock hook for managing screen wake state during sessions.
 *
 * Responsibilities:
 * - Keep screen awake only when timer is actively running
 * - Automatically release screen lock on pause/cancel/complete
 * - Provide explicit control methods for screen lock state
 */
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';

export function useScreenLock(isRunning: boolean) {
  useEffect(() => {
    let isActive = false;

    const activate = async () => {
      try {
        await activateKeepAwakeAsync();
        isActive = true;
      } catch (error) {
        console.warn('Failed to activate screen lock:', error);
      }
    };

    const deactivate = () => {
      try {
        deactivateKeepAwake();
        isActive = false;
      } catch (error) {
        console.warn('Failed to deactivate screen lock:', error);
      }
    };

    if (isRunning) {
      activate();
    } else {
      deactivate();
    }

    // Cleanup: deactivate when unmounting
    return () => {
      if (isActive) {
        deactivate();
      }
    };
  }, [isRunning]);
}