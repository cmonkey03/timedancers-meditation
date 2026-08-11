/**
 * Test ID constants for E2E testing
 */

export const TEST_IDS = {
  // Screen containers
  SCREEN_SESSION: 'screen-session',
  SCREEN_SETTINGS: 'screen-settings',
  SCREEN_ONBOARDING: 'screen-onboarding',

  // Theme selection
  THEME_SYSTEM: 'theme-system',
  THEME_LIGHT: 'theme-light',
  THEME_DARK: 'theme-dark',

  // Alert modes
  ALERT_MODE_CHIME: 'alert-mode-chime',
  ALERT_MODE_CHIME_HAPTIC: 'alert-mode-chime_haptic',
  ALERT_MODE_HAPTIC: 'alert-mode-haptic',
  ALERT_MODE_SILENT: 'alert-mode-silent',

  // Settings controls
  TEST_ALERT_BUTTON: 'test-alert-button',
  BACKGROUND_ALERTS_SWITCH: 'background-alerts-switch',
  DAILY_REMINDER_SWITCH: 'daily-reminder-switch',
  DAILY_REMINDER_TIME_BUTTON: 'daily-reminder-time-button',
  RESET_DEFAULTS_BUTTON: 'reset-defaults-button',

  // Session controls
  SESSION_START_BUTTON: 'session-start-button',
  SESSION_PAUSE_BUTTON: 'session-pause-button',
  SESSION_RESUME_BUTTON: 'session-resume-button',
  SESSION_CANCEL_BUTTON: 'session-cancel-button',
} as const;
