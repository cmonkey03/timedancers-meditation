import DismissKeyboard from '@/components/DismissKeyboard';
import { Control, Wheels } from '@/components/Session';
import { uiText } from '@/data/ui-text';
import { useChime } from '@/hooks/chime-context';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { useNotifications } from '@/hooks/use-notifications';
import { usePhasedTimer } from '@/hooks/use-phased-timer';
import { useSessionAppState } from '@/hooks/use-session-app-state';
import { useSessionAudio } from '@/hooks/use-session-audio';
import { useSessionCompletion } from '@/hooks/use-session-completion';
import { useSessionEffects } from '@/hooks/use-session-effects';
import { useSessionPersistence } from '@/hooks/use-session-persistence';
import { useThemeColors } from '@/hooks/use-theme';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';

export default function SessionScreen() {
  useKeepAwakeSafe();
  useSessionAudio();
  
  const C = useThemeColors();
  const appIsActiveRef = useSessionAppState();
  
  const initialPhases = useMemo(() => Timer.createPhasesFromMinutes(5), []);
  const { state: timer, start, pause, resume, reset, setPhases } = usePhasedTimer(initialPhases);
  
  // Alerts (chime/haptic) — single shared instance from ChimeProvider
  const { playStartAlert, triggerChime, resetChimeState, mode: alertMode } = useChime();

  const { 
    input, 
    allowBackgroundAlerts, 
    handleInput 
  } = useSessionPersistence(timer.started);

  // Notifications helper (scheduling, tokens, cleanup)
  const { scheduleNotificationsForRemaining, markSessionStart, clearSessionToken, coldStartCleanup } = useNotifications(
    timer,
    alertMode,
    allowBackgroundAlerts
  );

  // Handle cold start cleanup on mount
  useEffect(() => {
    coldStartCleanup();
  }, [coldStartCleanup]);

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

  // React to background-alerts toggle and alert-mode changes while running.
  // Reschedule background notifications when either setting changes.
  useEffect(() => {
    if (!timer.running) return;
    if (allowBackgroundAlerts) {
      scheduleNotificationsForRemaining();
    } else {
      Notifier.cancelAllScheduled();
    }
  }, [alertMode, allowBackgroundAlerts, timer.running, scheduleNotificationsForRemaining]);

  // Session effects (phase transitions, haptics)
  const prevIndexRef = useSessionEffects(timer, triggerChime);

  // Session completion handling
  const { showCompleted, resetCompletionTriggered } = useSessionCompletion(
    timer,
    triggerChime,
    clearSessionToken,
    reset,
    resetChimeState
  );

  const onPress = async (action: string) => {
    switch (action) {
      case 'counting':
        if (!timer.running && !timer.started) {
          // Start timer
          start();
          // Reset completion trigger ref for new session
          resetCompletionTriggered();
          // Schedule notifications for all upcoming phase transitions and completion
          if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
          // Persist expected end time for cold-start cleanup
          markSessionStart();
          // Initial phase alert: either instant or slightly debounced to avoid background glitch
          const fireStartAlert = () => {
            if (!appIsActiveRef.current) return;
            // Add a small delay to ensure audio player is ready
            setTimeout(() => {
              triggerChime('sessionStart');
            }, 300);
          };
          setTimeout(fireStartAlert, 120);
        } else if (!timer.running) {
          // Resume timer
          resume();
          // Re-schedule from current position
          if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
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
        // Reset chime state for new session
        resetChimeState();
        resetCompletionTriggered();
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

  return (
    <View style={{ flex: 1, backgroundColor: C.background }} testID="screen-session">
      <DismissKeyboard>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: C.background,
          }}
          accessibilityLabel={timer.running ? uiText.session.accessibility.sessionInProgress : uiText.session.status.setup}
          accessibilityRole="none"
        >
          <Wheels timer={timer} prevIndex={prevIndexRef} />
          
          {showCompleted && (
            <Text 
              style={{ marginTop: 16, color: C.buttonPrimary, fontWeight: '800', fontSize: 22, letterSpacing: 1 }}
              accessibilityLabel={uiText.session.accessibility.sessionComplete}
              accessibilityRole="alert"
              accessible={true}
            >
              {uiText.session.status.complete}
            </Text>
          )}
          
          <Control   
            counting={timer.running}
            handleInput={handleInput}
            input={input}
            onPress={onPress}
            started={timer.started}
          />
        </View>
      </DismissKeyboard>
    </View>
  );
}
