import { AlertMode } from '@/hooks/use-notifications';
import { getChimeVolume } from '@/utils/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform, Vibration } from 'react-native';

export type ChimeEvent = 'sessionStart' | 'phase1to2' | 'phase2to3' | 'sessionComplete';

type ChimeContextValue = {
  playStartAlert: () => Promise<void>;
  playCompletionAlert: () => Promise<void>;
  triggerChime: (event: ChimeEvent) => Promise<void>;
  resetChimeState: () => void;
  setMode: (mode: AlertMode) => void;
  updateVolume: (volume: number) => void;
  volume: number;
  mode: AlertMode;
};

const ChimeContext = createContext<ChimeContextValue | null>(null);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function ChimeProviderInner({ children }: { children: React.ReactNode }) {
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));

  const [mode, setModeState] = useState<AlertMode>('chime');
  const [volume, setVolume] = useState(0.7);
  
  // Track which chime events have been played in current session
  const [playedEvents, setPlayedEvents] = useState<Set<ChimeEvent>>(new Set());

  // Load saved settings on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedMode, savedVolume] = await Promise.all([
          AsyncStorage.getItem('alertMode'),
          getChimeVolume(),
        ]);
        if (
          savedMode === 'chime' ||
          savedMode === 'chime_haptic' ||
          savedMode === 'haptic' ||
          savedMode === 'silent'
        ) {
          setModeState(savedMode);
        }
        setVolume(savedVolume);
      } catch {}
    })();
  }, []);

  // Sync volume to audio players
  useEffect(() => {
    if (chime1) chime1.volume = volume;
    if (chime2) chime2.volume = volume;
  }, [volume, chime1, chime2]);

  const setMode = useCallback((newMode: AlertMode) => {
    setModeState(newMode);
    AsyncStorage.setItem('alertMode', newMode).catch(() => {});
    // Reset played events when mode changes so chimes replay
    setPlayedEvents(new Set());
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    AsyncStorage.setItem('chimeVolume', newVolume.toString()).catch(() => {});
  }, []);

  const playStartAlert = useCallback(async () => {
    if (mode === 'chime' || mode === 'chime_haptic') {
      try {
        if (chime1) {
          await chime1.pause();
          await chime1.seekTo(0);
          chime1.volume = volume;
          await chime1.play();
        }
      } catch (e) {
        console.log('[chime] error playing start chime:', e);
      }
    }
    if (mode === 'haptic' || mode === 'chime_haptic') {
      try {
        if (Platform.OS === 'android') {
          Vibration.vibrate([0, 200, 100, 300, 100, 200, 100, 300], false);
        } else {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          await delay(100);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(100);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(120);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch {}
    }
  }, [mode, chime1, volume]);

  const playCompletionAlert = useCallback(async () => {
    if (mode === 'chime' || mode === 'chime_haptic') {
      try {
        if (chime2) {
          await chime2.pause();
          await chime2.seekTo(0);
          chime2.volume = volume;
          await chime2.play();
        }
      } catch (e) {
        console.log('[chime] error playing completion chime:', e);
      }
    }
    if (mode === 'haptic' || mode === 'chime_haptic') {
      try {
        if (Platform.OS === 'android') {
          Vibration.vibrate([0, 300, 120, 400, 120, 300, 120, 400], false);
        } else {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          await delay(120);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(120);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(140);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch {}
    }
  }, [mode, chime2, volume]);

  const triggerChime = useCallback(async (event: ChimeEvent) => {
    // Don't play if already played in this session
    if (playedEvents.has(event)) return;
    
    // Don't play anything in silent mode
    if (mode === 'silent') return;

    // Play appropriate chime based on event type
    if (event === 'sessionComplete') {
      await playCompletionAlert();
    } else {
      await playStartAlert();
    }
    
    // Mark as played
    setPlayedEvents(prev => new Set(prev).add(event));
  }, [playedEvents, mode, playStartAlert, playCompletionAlert]);

  const resetChimeState = useCallback(() => {
    setPlayedEvents(new Set());
  }, []);

  const value: ChimeContextValue = {
    playStartAlert,
    playCompletionAlert,
    triggerChime,
    resetChimeState,
    setMode,
    updateVolume,
    volume,
    mode,
  };

  return <ChimeContext.Provider value={value}>{children}</ChimeContext.Provider>;
}

export function ChimeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChimeProviderInner>
      {children}
    </ChimeProviderInner>
  );
}

export function useChime(): ChimeContextValue {
  const ctx = useContext(ChimeContext);
  if (!ctx) {
    throw new Error('useChime must be used within a ChimeProvider');
  }
  return ctx;
}
