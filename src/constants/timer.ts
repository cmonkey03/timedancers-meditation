/**
 * Timer and phase constants
 */

export const PHASE_KEYS = {
  POWER: 'power',
  HEART: 'heart',
  WISDOM: 'wisdom',
} as const;

export const DEFAULT_PHASES = [
  { key: PHASE_KEYS.POWER, seconds: 5 * 60 },
  { key: PHASE_KEYS.HEART, seconds: 3 * 60 },
  { key: PHASE_KEYS.WISDOM, seconds: 7 * 60 },
] as const;

export const ALERT_MODES = {
  CHIME: 'chime',
  CHIME_HAPTIC: 'chime_haptic',
  HAPTIC: 'haptic',
  SILENT: 'silent',
} as const;

export const CHIME_EVENTS = {
  SESSION_START: 'sessionStart',
  PHASE_1_TO_2: 'phase1to2',
  PHASE_2_TO_3: 'phase2to3',
  SESSION_COMPLETE: 'sessionComplete',
} as const;
