/**
 * English locale strings
 */
export const en = {
  // Onboarding
  onboarding: {
    welcome: {
      title: 'Decolonize your destiny',
      subtitle: 'Unlock the power of timedancing through meditating on three sacred centers',
    },
    ringLabels: {
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
    buttons: {
      skip: 'Skip',
      next: 'Next',
      begin: 'Begin',
    },
    swipeToBegin: 'Swipe to begin',
    preview: 'Preview',
    instructions: [
      'Settle into your body and let time slow down. As you breathe, feel yourself dropping into this moment—the only moment that truly exists.',
      'Focus on your Power center below the navel. Here you discover timelessness through your core strength. Let yourself sink so deeply into this center that time dissolves, revealing your natural',
      "Move to your Heart center in your chest. In timelessness, love flows freely. Practice letting go—or if needed, dive so completely into what you're feeling that attachment releases itself.",
      'Rest in your Wisdom center at your forehead. From timelessness comes true knowing. Whether through gentle release or complete surrender, find the space where wisdom naturally arises.',
    ],
    pages: [
      { title: '', subtitle: '' },
      { title: 'Three Sacred Centers', subtitle: 0 },
      { title: 'Ring of Power', subtitle: 1 },
      { title: 'Ring of Heart', subtitle: 2 },
      { title: 'Ring of Wisdom', subtitle: 3 },
      { title: 'Ready to Begin?', subtitle: 'Tap the Session tab below to start your first session. Choose your duration and press Start.' },
    ],
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
      description: 'Choose your preferred appearance theme.',
    },
    dailyReminder: {
      enable: 'Enable daily reminder',
      hint: 'Toggle daily session reminder notification',
      setTimeHint: 'Tap to change daily reminder time',
      enableToSetTime: 'Enable daily reminder to set time',
      description: 'Schedule a local notification (24-hour).',
      timePlaceholder: 'HH:MM',
      timeAccessibilityLabel: 'Daily reminder time',
      notSet: 'not set',
    },
    alerts: {
      testAlert: 'Test alert',
      chimeVolume: 'Chime Volume',
      description: 'Choose how the app alerts you throughout your session.',
      playInBackground: 'Play alerts in background',
      backgroundDescription: 'Chimes & haptics still play if the app is in the background or the screen is locked.',
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
    language: {
      title: 'Language',
      english: 'English',
      spanish: 'Spanish',
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
    title: 'Explore',
    accessibility: {
      explorePage: 'Explore resources page',
      openLink: 'Opens in browser',
    },
    links: {
      aboutCreator: 'About the creator of this app',
      research: 'Research: Intimate Violence',
      newsletter: 'Newsletter',
    },
  },

  // Common
  common: {
    loading: 'Loading...',
  },

  // Notifications
  notifications: {
    sessionComplete: 'Session complete',
    sessionFinished: 'Session finished',
    dailyReminderBody: "Ready for today's session?",
    channelDefault: 'Default',
    channelSessionTimer: 'Session Timer',
  },

  // Tab Bar
  tabs: {
    home: 'Start',
    session: 'Session',
    settings: 'Settings',
    explore: 'Explore',
  },
} as const;
