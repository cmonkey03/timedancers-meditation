/**
 * AsyncStorage key constants
 */

export const STORAGE_KEYS = {
  LAST_DURATION_MINUTES: 'lastDurationMinutes',
  ALERT_MODE: 'alertMode',
  CHIME_VOLUME: 'chimeVolume',
  ALLOW_BACKGROUND_ALERTS: 'allowBackgroundAlerts',
  DAILY_REMINDER_ENABLED: 'dailyReminderEnabled',
  DAILY_REMINDER_TIME: 'dailyReminderTime',
  DAILY_REMINDER_ID: 'dailyReminderId',
  ACTIVE_SESSION_END_AT_MS: 'activeSessionEndAtMs',
  THEME_OVERRIDE: 'themeOverride',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
} as const;
