/**
 * Backwards compatibility exports for hooks
 * Re-exports from organized subdirectories
 */

// Session hooks
export { usePhasedTimer } from './session/use-phased-timer';
export { useSessionAudio } from './session/use-session-audio';
export { useSessionCompletion } from './session/use-session-completion';
export { useSessionEffects } from './session/use-session-effects';
export { useSessionPersistence } from './session/use-session-persistence';

// Platform hooks
export { useKeepAwakeSafe } from './platform/use-keep-awake-safe';
export { useNotifications } from './platform/use-notifications';
export { useSessionAppState } from './platform/use-session-app-state';

// UI hooks
export { useCustomFonts } from './ui/use-fonts';
export { useThemeColors } from './ui/use-theme';

// Other hooks (still in root)
export { useChime } from './chime-context';
export { useThemeOverride } from './theme-override';
export { useAppState } from './use-app-state';
export { useColorScheme } from './use-color-scheme';
export { useReducedMotion } from './use-reduced-motion';
