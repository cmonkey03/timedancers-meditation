import Button from '@/components/Button';
import WheelControls from '@/components/WheelControls';
import WheelTower from '@/components/WheelTower';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import displayTime from '@/utils/displayTime';
import * as Timer from '@/utils/timer';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

// Timer/UI constants
const TICK_MS = 250;
const START_CHIME_WINDOW_MS = 500;

type Props = {
  handler: React.Dispatch<React.SetStateAction<any>>;
  onboarded: boolean;
};

const Meditation = ({ handler, onboarded }: Props) => {
  useKeepAwakeSafe();
  const [input, setInput] = useState('3');
  const [timerState, setTimerState] = useState<Timer.TimerState>(() => 
    Timer.newState(Timer.createPhasesFromMinutes(3))
  );
  const [currentTime, setCurrentTime] = useState(() => Timer.computeNow(timerState));

  // expo-audio players for chimes
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));

  // Configure audio once (silent mode, etc.)
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true });
      } catch {
        // ignore
      }
    })();
  }, []);

  // Prefill input from last used duration
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('lastDurationMinutes');
        if (stored && !timerState.startAt) {
          setInput(stored);
        }
      } catch {
        // ignore storage errors
      }
    })();
  }, [timerState.startAt]);

  // Persist input when it changes (only when not started)
  useEffect(() => {
    if (!timerState.startAt) {
      AsyncStorage.setItem('lastDurationMinutes', input).catch(() => {});
    }
  }, [input, timerState.startAt]);

  const handleInput = (text: string) => {
    if (typeof text === 'string' && !Number.isNaN(Number(text))) {
      setInput(text);
    }
  };

  // Update timer phases when input changes
  useEffect(() => {
    if (!timerState.running && !timerState.startAt) {
      const minutes = parseInt(input) || 3;
      const newPhases = Timer.createPhasesFromMinutes(minutes);
      const newState = Timer.newState(newPhases);
      setTimerState(newState);
      setCurrentTime(Timer.computeNow(newState));
    }
  }, [input, timerState.running, timerState.startAt]);

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
        if (!timerState.running && !timerState.startAt) {
          // Start timer
          const newState = Timer.start(timerState);
          setTimerState(newState);
          // Initial phase chime at session start to match previous behavior
          playPreloadedChime(1);
          // Initialize phase index tracking
          lastPhaseIndexRef.current = 0;
          // Mark start chime as done to avoid the interval safety net playing it again
          startChimeDoneRef.current = true;
        } else if (!timerState.running) {
          // Resume timer
          const newState = Timer.resume(timerState);
          setTimerState(newState);
          // Ensure we don't replay the start chime after a resume
          startChimeDoneRef.current = true;
        }
        break;
      case 'cancel':
        // Reset timer
        const minutes = parseInt(input) || 3;
        const newPhases = Timer.createPhasesFromMinutes(minutes);
        const resetState = Timer.newState(newPhases);
        setTimerState(resetState);
        setCurrentTime(Timer.computeNow(resetState));
        break;
      case 'pause':
        // Pause timer
        const pausedState = Timer.pause(timerState);
        setTimerState(pausedState);
        break;
      default:
        break;
    }
  };

  // Track last phase index for chime detection
  const lastPhaseIndexRef = useRef(0);
  // Guard to ensure start chime only plays once
  const startChimeDoneRef = useRef(false);
  // Guard to ensure completion chime only plays once
  const completionChimeDoneRef = useRef(false);

  // Main timer effect - updates current time and handles chimes
  useEffect(() => {
    let interval: any;

    if (timerState.running && chime1 && chime2) {
      interval = setInterval(() => {
        const newCurrentTime = Timer.computeNow(timerState);
        setCurrentTime(newCurrentTime);

        // Ensure we chime at the very start of the session even if the player wasn't ready on press
        if (
          !startChimeDoneRef.current &&
          newCurrentTime.currentIndex === 0 &&
          !newCurrentTime.done
        ) {
          const phase0Ms = (timerState.phases[0]?.seconds ?? 0) * 1000;
          // If we're within the first N ms of the first phase, play start chime
          if (phase0Ms > 0 && phase0Ms - newCurrentTime.phaseRemainingMs <= START_CHIME_WINDOW_MS) {
            if (__DEV__) console.log('[chime] start-of-session');
            playPreloadedChime(1);
            startChimeDoneRef.current = true;
          }
        }

        // Check for phase transitions to play chimes
        if (newCurrentTime.currentIndex > lastPhaseIndexRef.current && !newCurrentTime.done) {
          if (__DEV__) console.log(`[chime] phase transition ${lastPhaseIndexRef.current} -> ${newCurrentTime.currentIndex}`);
          playPreloadedChime(1); // Phase transition chime
        }
        lastPhaseIndexRef.current = newCurrentTime.currentIndex;

        // Check if meditation is complete
        if (newCurrentTime.done) {
          if (!completionChimeDoneRef.current) {
            if (__DEV__) console.log('[chime] session complete');
            playPreloadedChime(2); // Completion chime
            completionChimeDoneRef.current = true;
          }
          // Stop running to avoid re-scheduling intervals
          setTimerState(prev => ({ ...prev, running: false }));
          clearInterval(interval);
        }
      }, TICK_MS); // Update frequently for smooth display with lighter CPU usage
    }

    return () => clearInterval(interval);
  }, [timerState, playPreloadedChime, chime1, chime2]);

  // Reset phase index when timer resets
  useEffect(() => {
    if (!timerState.startAt) {
      lastPhaseIndexRef.current = 0;
      startChimeDoneRef.current = false;
      completionChimeDoneRef.current = false;
    }
  }, [timerState.startAt]);

  // Update current time when timer state changes (for immediate feedback)
  useEffect(() => {
    setCurrentTime(Timer.computeNow(timerState));
  }, [timerState]);

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
          const phaseMs = (timerState.phases[i]?.seconds ?? 0) * 1000;
          if (!timerState.startAt) return phaseMs; // not started yet
          if (currentTime.done) return 0;
          if (currentTime.currentIndex === i) return currentTime.phaseRemainingMs;
          if (currentTime.currentIndex > i) return 0;
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
          />
        );
      })()}
      <WheelControls
        counting={timerState.running}
        handleInput={handleInput}
        input={input}
        onPress={onPress}
        started={timerState.startAt !== null}
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
