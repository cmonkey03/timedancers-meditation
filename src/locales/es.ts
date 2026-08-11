/**
 * Spanish locale strings
 */
export const es = {
  // Onboarding
  onboarding: {
    welcome: {
      title: 'Descoloniza tu destino',
      subtitle: 'Desbloquea el poder del baile del tiempo meditando en tres centros sagrados',
    },
    ringLabels: {
      wisdom: 'Sabiduría',
      heart: 'Corazón',
      power: 'Poder',
    },
    accessibility: {
      skipTutorial: 'Saltar el tutorial de bienvenida',
      nextScreen: 'Ir a la siguiente pantalla de bienvenida',
      completeOnboarding: 'Completar la bienvenida y comenzar a usar la aplicación',
      onboardingTutorial: 'Tutorial de bienvenida',
    },
  },

  // Session
  session: {
    buttons: {
      start: 'Iniciar',
      pause: 'Pausar',
      resume: 'Reanudar',
      cancel: 'Cancelar',
    },
    status: {
      inProgress: 'Sesión en progreso',
      paused: 'Sesión pausada',
      complete: '¡Sesión completa!',
      setup: 'Configuración del temporizador de sesión',
    },
    instructions: {
      selectTime: 'Seleccionar tiempo de sesión',
    },
    accessibility: {
      sessionInProgress: 'Sesión en progreso',
      sessionComplete: 'Sesión completa',
      selectDuration: 'Seleccionar duración de la sesión en minutos. Actualmente',
      swipeToSelect: 'Desliza hacia arriba o abajo para seleccionar el tiempo de sesión',
      readyToStart: 'Listo para comenzar',
      selectSessionTime: 'Seleccionar tiempo de sesión',
    },
  },

  // Settings
  settings: {
    title: 'Configuración',
    buttons: {
      resetToDefaults: 'Restablecer valores predeterminados',
      cancel: 'Cancelar',
      done: 'Hecho',
    },
    sections: {
      theme: 'Tema',
      alerts: 'Alertas',
      dailyReminder: 'Recordatorio diario',
    },
    theme: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Oscuro',
    },
    dailyReminder: {
      enable: 'Activar recordatorio diario',
      hint: 'Activar notificación de recordatorio de sesión diaria',
      setTimeHint: 'Toca para cambiar la hora del recordatorio diario',
      enableToSetTime: 'Activar recordatorio diario para establecer la hora',
      description: 'Programar una notificación local (24 horas).',
      timePlaceholder: 'HH:MM',
    },
    alerts: {
      testAlert: 'Probar alerta',
      chimeVolume: 'Volumen de la campana',
      modes: {
        chime: 'Campana',
        chimeHaptic: 'Campana + Vibración',
        haptic: 'Vibración',
        silent: 'Silencio',
      },
      accessibility: {
        testAlert: 'Probar alerta',
        chimeVolume: 'Volumen de la campana',
        adjustVolume: 'Desliza hacia la izquierda o derecha para ajustar el volumen',
      },
    },
    accessibility: {
      settingsPage: 'Página de configuración',
    },
    language: {
      title: 'Idioma',
      english: 'Inglés',
      spanish: 'Español',
    },
  },

  // Time Picker
  timePicker: {
    buttons: {
      cancel: 'Cancelar',
      done: 'Hecho',
    },
  },

  // Explore
  explore: {
    accessibility: {
      explorePage: 'Página de recursos de exploración',
    },
  },

  // Common
  common: {
    loading: 'Cargando...',
  },

  // Tab Bar
  tabs: {
    home: 'Inicio',
    session: 'Sesión',
    settings: 'Configuración',
    explore: 'Explorar',
  },
} as const;
