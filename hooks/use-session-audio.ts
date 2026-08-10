/**
 * Audio configuration hook for session sessions.
 *
 * Responsibilities:
 * - Configure audio mode once on mount
 * - Handle silent mode and background playback settings
 */
import { setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';

export function useSessionAudio() {
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          allowsRecording: false,
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
}
