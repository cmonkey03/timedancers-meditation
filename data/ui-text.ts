export const uiText = {
  // Onboarding
  onboarding: {
    welcome: {
      title: 'Decolonize your destiny',
      subtitle: 'Unlock the power of timedancing through meditating on three sacred centers',
    },
    wheelLabels: {
      wisdom: 'Wisdom',
      heart: 'Heart',
      power: 'Power',
    },
    accessibility: {
      skipTutorial: 'Skip the onboarding tutorial',
      nextScreen: 'Go to next onboarding screen',
      completeOnboarding: 'Complete onboarding and start using the app',
      onboardingTutorial: 'Onboarding tutorial',
    },
  },

  // Session
  session: {
    buttons: {
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      cancel: 'Cancel',
    },
    status: {
      inProgress: 'Session in progress',
      paused: 'Session paused',
      complete: 'Session complete!',
      setup: 'Session timer setup',
    },
    instructions: {
      selectTime: 'Select session time',
    },
    accessibility: {
      sessionInProgress: 'Session session in progress',
      sessionComplete: 'Session session complete',
      selectDuration: 'Select session duration in minutes. Currently',
      swipeToSelect: 'Swipe up or down to select session time',
      readyToStart: 'Ready to start',
      selectSessionTime: 'Select session time',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    buttons: {
      resetToDefaults: 'Reset to defaults',
      cancel: 'Cancel',
      done: 'Done',
    },
    sections: {
      theme: 'Theme',
      alerts: 'Alerts',
      dailyReminder: 'Daily Reminder',
    },
    theme: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
    dailyReminder: {
      enable: 'Enable daily reminder',
      hint: 'Toggle daily session reminder notification',
      setTimeHint: 'Tap to change daily reminder time',
      enableToSetTime: 'Enable daily reminder to set time',
      description: 'Schedule a local notification (24-hour).',
      timePlaceholder: 'HH:MM',
    },
    alerts: {
      testAlert: 'Test alert',
      chimeVolume: 'Chime Volume',
      modes: {
        chime: 'Chime',
        chimeHaptic: 'Chime + Vibrate',
        haptic: 'Vibrate',
        silent: 'Silent',
      },
      accessibility: {
        testAlert: 'Test alert',
        chimeVolume: 'Chime volume',
        adjustVolume: 'Swipe left or right to adjust volume',
      },
    },
    accessibility: {
      settingsPage: 'Settings page',
    },
  },

  // Time Picker
  timePicker: {
    buttons: {
      cancel: 'Cancel',
      done: 'Done',
    },
  },

  // Explore
  explore: {
    accessibility: {
      explorePage: 'Explore resources page',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
  },

  // Tab Bar
  tabs: {
    home: 'Start',
    session: 'Session',
    settings: 'Settings',
    explore: 'Explore',
  },
} as const;