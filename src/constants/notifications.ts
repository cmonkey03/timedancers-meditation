/**
 * Notification constants
 */

export const NOTIFICATION_CHANNELS = {
  DEFAULT: 'default',
  SESSION_TIMER: 'session-timer-v2',
} as const;

export const NOTIFICATION_TITLES = {
  SESSION_COMPLETE: 'Session complete',
  DAILY_REMINDER: 'Timewheel',
} as const;

export const NOTIFICATION_BODIES = {
  SESSION_FINISHED: 'Session finished',
  DAILY_REMINDER: 'Ready for today\'s session?',
} as const;

export const NOTIFICATION_IMPORTANCE = {
  HIGH: 'high',
} as const;
