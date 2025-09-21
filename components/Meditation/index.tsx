import Button from '@/components/Button';
import WheelControls from '@/components/WheelControls';
import WheelTower from '@/components/WheelTower';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { usePhasedTimer } from '@/hooks/use-phased-timer';
import displayTime from '@/utils/displayTime';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Text, View } from 'react-native';

// Timer/UI constants
const START_CHIME_WINDOW_MS = 500;

type Props = {
  handler: React.Dispatch<React.SetStateAction<any>>;
  onboarded: boolean;
};

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const Meditation = ({ handler, onboarded }: Props) => {
  useKeepAwakeSafe();
  const [input, setInput] = useState('3');
  const initialPhases = Timer.createPhasesFromMinutes(3);
  const { state: timer, start, pause, resume, reset, setPhases } = usePhasedTimer(initialPhases);
  const [alertMode, setAlertMode] = useState<'chime' | 'chime_haptic' | 'haptic' | 'silent'>(() => 'chime');
  const appIsActiveRef = useRef(true);
  const [showCompleted, setShowCompleted] = useState(false);

  // expo-audio players for chimes
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));

  // Configure audio once (silent mode, etc.)
  useEffect(() => {
    // Ensure notifications are initialized (permissions + Android channels)
    Notifier.initNotifications().catch(() => {});
    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true, staysActiveInBackground: true } as any);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  // Prefill input from last used duration
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('lastDurationMinutes');
        if (stored && !timer.started) {
          setInput(stored);
        }
        const savedMode = await AsyncStorage.getItem('alertMode');
        if (savedMode === 'chime' || savedMode === 'chime_haptic' || savedMode === 'haptic' || savedMode === 'silent') {
          setAlertMode(savedMode);
        }
      } catch {
        // ignore storage errors
      }
    })();
  }, [timer.started]);

  // Schedule local notifications for remaining phase transitions and completion (absolute wall-clock)
  const scheduleNotificationsForRemaining = useCallback(async () => {
    if (!timer.started || timer.startAtMs == null) return;
    // Cancel any existing first
    await Notifier.cancelAllScheduled();

    // Compute elapsed and remaining boundaries using wall clock and pausedTotal
    const nowMs = Date.now();
    const elapsedMs = Math.max(0, nowMs - timer.startAtMs - timer.pausedTotalMs);

    // Build cumulative boundaries in ms for each phase end
    const cumMs: number[] = [];
    let acc = 0;
    for (const p of timer.phases) {
      acc += (p.seconds || 0) * 1000;
      cumMs.push(acc);
    }

    // Schedule for each remaining boundary strictly after elapsed using absolute timestamps
    const withSound = alertMode === 'chime' || alertMode === 'chime_haptic';
    const baseEpoch = (timer.startAtMs ?? 0) + timer.pausedTotalMs; // session zero point + paused time
    for (let i = 0; i < cumMs.length; i++) {
      const boundary = cumMs[i];
      if (boundary <= elapsedMs) continue;
      const whenEpochMs = baseEpoch + boundary;
      const isCompletion = i === cumMs.length - 1;
      if (isCompletion) {
        await Notifier.scheduleAtMs(whenEpochMs, 'Meditation complete', 'Session finished', { withSound });
      } else {
        const nextKey = timer.phases[i + 1]?.key ?? 'next phase';
        await Notifier.scheduleAtMs(whenEpochMs, 'Phase change', `Begin ${capitalize(nextKey)}`, { withSound });
      }
    }
  }, [timer.started, timer.startAtMs, timer.pausedTotalMs, timer.phases, alertMode]);

  // Schedule notifications when app backgrounds; cancel when active
  useEffect(() => {
    const onChange = (s: AppStateStatus) => {
      appIsActiveRef.current = s === 'active';
      if (s === 'active') {
        // Back to foreground: cancel scheduled notifications; app will play in-app chimes
        Notifier.cancelAllScheduled();
      } else if (timer.running) {
        // Backgrounded or inactive: schedule remaining notifications if session is running
        scheduleNotificationsForRemaining();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [scheduleNotificationsForRemaining, timer.running]);

  // Persist input when it changes (only when not started)
  useEffect(() => {
    if (!timer.started) {
      AsyncStorage.setItem('lastDurationMinutes', input).catch(() => {});
    }
  }, [input, timer.started]);

  // Persist alertMode immediately when it changes
  useEffect(() => {
    AsyncStorage.setItem('alertMode', alertMode).catch(() => {});
  }, [alertMode]);


  const handleInput = (text: string) => {
    if (typeof text === 'string' && !Number.isNaN(Number(text))) {
      setInput(text);
    }
  };

  // Update timer phases when input changes
  useEffect(() => {
    if (!timer.running && !timer.started) {
      const minutes = parseInt(input) || 3;
      const newPhases = Timer.createPhasesFromMinutes(minutes);
      setPhases(newPhases);
    }
  }, [input, timer.running, timer.started, setPhases]);

  const playPreloadedChime = useCallback(async (which: 1 | 2) => {
    try {
      const p = which === 1 ? chime1 : chime2;
      if (!p) return;
      // expo-audio does not auto-reset to start after ending
      if (__DEV__) console.log(`[chime] request -> which=${which}`);
      await p.seekTo(0);
      await p.play();
      if (__DEV__) console.log(`[chime] played -> which=${which}`);
    } catch (e) {
      if (__DEV__) console.log('[chime] error', e);
    }
  }, [chime1, chime2]);

  const onPress = (action: string) => {
    switch (action) {
      case 'counting':
        if (!timer.running && !timer.started) {
          // Start timer
          start();
          // Schedule notifications for all upcoming phase transitions and completion
          scheduleNotificationsForRemaining();
          // Initial phase alert: either instant or slightly debounced to avoid background glitch
          const fireStartAlert = () => {
            if (!appIsActiveRef.current) return;
            if (alertMode === 'chime' || alertMode === 'chime_haptic') {
              playPreloadedChime(1);
            }
            if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            }
          };
          setTimeout(fireStartAlert, 120);
          // Initialize phase index tracking
          lastPhaseIndexRef.current = 0;
          // Mark start chime as done to avoid the interval safety net playing it again
          startChimeDoneRef.current = true;
        } else if (!timer.running) {
          // Resume timer
          resume();
          // Re-schedule from current position
          scheduleNotificationsForRemaining();
          // Ensure we don't replay the start chime after a resume
          startChimeDoneRef.current = true;
        }
        break;
      case 'cancel':
        // Reset timer
        const minutes = parseInt(input) || 3;
        const newPhases = Timer.createPhasesFromMinutes(minutes);
        setPhases(newPhases);
        reset();
        // Cancel any scheduled notifications
        Notifier.cancelAllScheduled();
        break;
      case 'pause':
        // Pause timer
        pause();
        // Cancel notifications while paused; will be re-scheduled on resume
        Notifier.cancelAllScheduled();
        break;
      default:
        if (action === 'test_alert') {
          // Preview the currently selected alert mode
          if (alertMode === 'chime' || alertMode === 'chime_haptic') {
            playPreloadedChime(timer.running ? 1 : 1);
          }
          if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          }
          break;
        }
        break;
    }
  };

  // Track last phase index for chime detection
  const lastPhaseIndexRef = useRef(0);
  // Guard to ensure start chime only plays once
  const startChimeDoneRef = useRef(false);
  // Guard to ensure completion chime only plays once
  const completionChimeDoneRef = useRef(false);
  const completionResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React to timer state updates (from hook) to trigger chimes / haptics based on mode
  useEffect(() => {
    const newCurrentTime = timer.now;

    // Ensure we chime at the very start of the session even if the player wasn't ready on press
    if (
      timer.running &&
      !startChimeDoneRef.current &&
      newCurrentTime.currentIndex === 0 &&
      !newCurrentTime.done
    ) {
      const phase0Ms = (timer.phases[0]?.seconds ?? 0) * 1000;
      if (phase0Ms > 0 && phase0Ms - newCurrentTime.phaseRemainingMs <= START_CHIME_WINDOW_MS) {
        if (__DEV__) console.log('[chime] start-of-session');
        if (alertMode === 'chime' || alertMode === 'chime_haptic') {
          playPreloadedChime(1);
        }
        if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }
        startChimeDoneRef.current = true;
      }
    }

    // Phase transition chime
    if (newCurrentTime.currentIndex > lastPhaseIndexRef.current && !newCurrentTime.done) {
      if (__DEV__) console.log(`[chime] phase transition ${lastPhaseIndexRef.current} -> ${newCurrentTime.currentIndex}`);
      if (alertMode === 'chime' || alertMode === 'chime_haptic') {
        playPreloadedChime(1);
      }
      if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
    }
    lastPhaseIndexRef.current = newCurrentTime.currentIndex;

    // Completion chime
    if (newCurrentTime.done && !completionChimeDoneRef.current) {
      if (__DEV__) console.log('[chime] session complete');
      if (alertMode === 'chime' || alertMode === 'chime_haptic') {
        playPreloadedChime(2);
      }
      if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      completionChimeDoneRef.current = true;
      // Cancel any pending notifications now that we're done
      Notifier.cancelAllScheduled();
      // Show completion state briefly, then reset back to Start/input
      if (completionResetTimeoutRef.current) clearTimeout(completionResetTimeoutRef.current);
      setShowCompleted(true);
      completionResetTimeoutRef.current = setTimeout(() => {
        reset();
        setShowCompleted(false);
      }, 2000);
    }
  }, [timer, playPreloadedChime, alertMode, reset]);

  // Cleanup any pending completion reset timeout on unmount
  useEffect(() => {
    return () => {
      if (completionResetTimeoutRef.current) clearTimeout(completionResetTimeoutRef.current);
    };
  }, []);

  // Reset phase index when timer resets
  useEffect(() => {
    if (!timer.started) {
      lastPhaseIndexRef.current = 0;
      startChimeDoneRef.current = false;
      completionChimeDoneRef.current = false;
      setShowCompleted(false);
    }
  }, [timer.started]);

  // No local tick loop; timing managed by usePhasedTimer

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      {(() => {
        const getPhaseRemainingMs = (i: number): number => {
          const phaseMs = (timer.phases[i]?.seconds ?? 0) * 1000;
          if (!timer.started) return phaseMs; // not started yet
          if (timer.now.done) return 0;
          if (timer.now.currentIndex === i) return timer.now.phaseRemainingMs;
          if (timer.now.currentIndex > i) return 0;
          return phaseMs;
        };

        const t1 = displayTime(Timer.getRemainingSeconds(getPhaseRemainingMs(0)));
        const t2 = displayTime(Timer.getRemainingSeconds(getPhaseRemainingMs(1)));
        const t3 = displayTime(Timer.getRemainingSeconds(getPhaseRemainingMs(2)));

        return (
          <WheelTower
            large={true}
            text1={t1}
            text2={t2}
            text3={t3}
            label1={capitalize(timer.phases[0]?.key ?? '')}
            label2={capitalize(timer.phases[1]?.key ?? '')}
            label3={capitalize(timer.phases[2]?.key ?? '')}
          />
        );
      })()}
      {showCompleted && (
        <Text style={{ marginTop: 12, color: '#1a5632', fontWeight: '700', fontSize: 18 }}>Session complete</Text>
      )}
      <WheelControls
        counting={timer.running}
        handleInput={handleInput}
        input={input}
        onPress={onPress}
        started={timer.started}
        alertMode={alertMode}
        onChangeAlertMode={setAlertMode}
      />
      <View style={{ height: 64 }} />
      <Button
        backgroundColor="#e4ede7"
        onPress={() => handler(!onboarded)}
        text="Instructions"
      />
    </View>
  );
};

export default Meditation;
