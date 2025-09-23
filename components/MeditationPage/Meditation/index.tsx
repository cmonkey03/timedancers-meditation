import WheelControls from '@/components/MeditationPage/WheelControls';
import Wheel from '@/components/MeditationPage/Wheel';
import { useAlerts } from '@/hooks/use-alerts';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { useNotifications } from '@/hooks/use-notifications';
import { usePhasedTimer } from '@/hooks/use-phased-timer';
import { useThemeColors } from '@/hooks/use-theme';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Text, View } from 'react-native';

// Timer/UI constants
const START_CHIME_WINDOW_MS = 500;

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Wheel definitions with rainbow colors (bottom to top: yellow/red → blue/green → purple/indigo)
const WHEELS = [
  { key: "power",  seconds: 60, colors: ["yellow", "red"] as [string, string] }, // Yellow to Red (bottom)
  { key: "heart",   seconds: 60, colors: ["blue", "green"] as [string, string] }, // Blue to Green (middle)  
  { key: "wisdom", seconds: 60, colors: ["purple", "indigo"] as [string, string] }, // Purple to Indigo (top)
] as const;

const Meditation = () => {
  useKeepAwakeSafe();
  const C = useThemeColors();
  const [input, setInput] = useState('3');
  const initialPhases = useMemo(() => Timer.createPhasesFromMinutes(3), []);
  const { state: timer, start, pause, resume, reset, setPhases } = usePhasedTimer(initialPhases);
  const [alertMode, setAlertMode] = useState<'chime' | 'chime_haptic' | 'haptic' | 'silent'>(() => 'chime');
  const [allowBackgroundAlerts, setAllowBackgroundAlerts] = useState<boolean>(true);
  const appIsActiveRef = useRef(true);
  const [showCompleted, setShowCompleted] = useState(false);

  // Simple equal-division phases when idle: recompute from minutes input
  useEffect(() => {
    if (timer.running || timer.started) return;
    const minutes = parseInt(input) || 3;
    const next = Timer.createPhasesFromMinutes(minutes);
    const curr = timer.phases;
    const differs =
      curr[0]?.seconds !== next[0].seconds ||
      curr[1]?.seconds !== next[1].seconds ||
      curr[2]?.seconds !== next[2].seconds;
    if (differs) setPhases(next);
  }, [input, timer.running, timer.started, timer.phases, setPhases]);

  // Alerts (chime/haptic)
  const { playStartAlert, playCompletionAlert } = useAlerts(alertMode);

  // Configure audio once (silent mode, etc.)
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true, staysActiveInBackground: true } as any);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  // Notifications helper (scheduling, tokens, cleanup)
  const { scheduleNotificationsForRemaining, markSessionStart, clearSessionToken, coldStartCleanup } = useNotifications(
    timer,
    alertMode,
    allowBackgroundAlerts
  );

  // Prefill input from last used duration and restore settings; clear stale notifications on cold start
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
        const savedAllowBg = await AsyncStorage.getItem('allowBackgroundAlerts');
        if (savedAllowBg === 'true' || savedAllowBg === 'false') {
          setAllowBackgroundAlerts(savedAllowBg === 'true');
        }
        // Cold start cleanup
        await coldStartCleanup();
      } catch {
        // ignore storage errors
      }
    })();
  }, [timer.started, coldStartCleanup]);

  // Keep app active state ref updated (used to avoid firing start alert during backgrounding)
  useEffect(() => {
    const onChange = (s: any) => {
      appIsActiveRef.current = s === 'active';
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

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

  // Persist allowBackgroundAlerts
  useEffect(() => {
    AsyncStorage.setItem('allowBackgroundAlerts', allowBackgroundAlerts ? 'true' : 'false').catch(() => {});
  }, [allowBackgroundAlerts]);

  // React immediately to background alerts toggle changes while running
  useEffect(() => {
    if (!timer.running) return;
    if (allowBackgroundAlerts) {
      // Reschedule remaining notifications now that it's enabled
      scheduleNotificationsForRemaining();
    } else {
      // Cancel any scheduled notifications now that it's disabled
      Notifier.cancelAllScheduled();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowBackgroundAlerts, timer.running]);

  const handleInput = (text: string) => {
    if (typeof text === 'string' && !Number.isNaN(Number(text))) {
      setInput(text);
    }
  };

  const onPress = async (action: string) => {
    switch (action) {
      case 'counting':
        if (!timer.running && !timer.started) {
          // Start timer
          start();
          // Schedule notifications for all upcoming phase transitions and completion
          if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
          // Persist expected end time for cold-start cleanup
          markSessionStart();
          // Initial phase alert: either instant or slightly debounced to avoid background glitch
          const fireStartAlert = () => {
            if (!appIsActiveRef.current) return;
            playStartAlert();
          };
          setTimeout(fireStartAlert, 120);
          // Mark start chime as done to avoid the interval safety net playing it again
          startChimeDoneRef.current = true;
        } else if (!timer.running) {
          // Resume timer
          resume();
          // Re-schedule from current position
          if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
          // Ensure we don't replay the start chime after a resume
          startChimeDoneRef.current = true;
          completionChimeDoneRef.current = false;
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
        clearSessionToken();
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
          playStartAlert();
          break;
        }
        break;
    }
  };

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
        playStartAlert();
        startChimeDoneRef.current = true;
      }
    }

    // Completion chime
    if (newCurrentTime.done && !completionChimeDoneRef.current) {
      if (__DEV__) console.log('[chime] session complete');
      playCompletionAlert();
      completionChimeDoneRef.current = true;
      // Cancel any pending notifications now that we're done
      Notifier.cancelAllScheduled();
      clearSessionToken();
      // Show completion state briefly, then reset back to Start/input
      if (completionResetTimeoutRef.current) clearTimeout(completionResetTimeoutRef.current);
      setShowCompleted(true);
      completionResetTimeoutRef.current = setTimeout(() => {
        reset();
        setShowCompleted(false);
      }, 2000);
    }
  }, [timer, playStartAlert, playCompletionAlert, alertMode, reset, clearSessionToken]);

  // Cleanup any pending completion reset timeout on unmount
  useEffect(() => {
    return () => {
      if (completionResetTimeoutRef.current) clearTimeout(completionResetTimeoutRef.current);
    };
  }, []);

  // Haptic feedback on wheel change
  const prevIndex = useRef(timer.now.currentIndex);
  useEffect(() => {
    if (timer.now.currentIndex !== prevIndex.current && !timer.now.done) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      prevIndex.current = timer.now.currentIndex;
    }
  }, [timer.now.currentIndex, timer.now.done]);

  // Reset phase index when timer resets
  useEffect(() => {
    if (!timer.started) {
      startChimeDoneRef.current = false;
      completionChimeDoneRef.current = false;
      setShowCompleted(false);
      prevIndex.current = 0;
    }
  }, [timer.started]);

  // No local tick loop; timing managed by usePhasedTimer

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: C.background,
      }}
    >
      {(() => {
        // Create wheel cards in correct order (wisdom at top, power at bottom)
        const wheelOrder = [2, 1, 0]; // wisdom, heart, power (top to bottom)
        
        return wheelOrder.map((i) => {
          const wheel = WHEELS[i];
          const isActive = i === timer.now.currentIndex && !timer.now.done && timer.now.phaseRemainingMs > 0;
          const justReleased = 
            i === prevIndex.current && !isActive && timer.now.phaseRemainingMs === 0;
          const isDone = i < timer.now.currentIndex || timer.now.done;

          const wheelState: "idle" | "active" | "releasing" | "done" =
            isActive ? "active" : justReleased ? "releasing" : isDone ? "done" : "idle";

          const total = timer.phases[i]?.seconds ?? wheel.seconds;
          const remaining = (() => {
            if (i === timer.now.currentIndex) {
              return Timer.getRemainingSeconds(timer.now.phaseRemainingMs);
            }
            if (isDone) return 0;
            return total;
          })();

          const big = isActive && timer.started;
          
          return (
            <View key={wheel.key} style={{ alignItems: "center", marginVertical: 8 }}>
              <Wheel
                size={big ? 200 : 120}
                label={capitalize(wheel.key)}
                remaining={remaining}
                total={total}
                state={wheelState}
                colors={wheel.colors}
              />
            </View>
          );
        });
      })()}
      
      {showCompleted && (
        <Text style={{ marginTop: 12, color: C.text, fontWeight: '700', fontSize: 18 }}>Session complete</Text>
      )}
      
      <WheelControls
        counting={timer.running}
        handleInput={handleInput}
        input={input}
        onPress={onPress}
        started={timer.started}
      />
    </View>
  );
};

export default Meditation;
