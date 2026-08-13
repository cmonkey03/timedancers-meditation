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
    buttons: {
      skip: 'Omitir',
      next: 'Siguiente',
      begin: 'Comenzar',
    },
    swipeToBegin: 'Desliza para comenzar',
    preview: 'Vista previa',
    instructions: [
      'Asiéntate en tu cuerpo y deja que el tiempo se desacelere. Mientras respiras, siente cómo te sumerges en este momento: el único momento que realmente existe.',
      'Concéntrate en tu centro de Poder, debajo del ombligo. Aquí descubres la atemporalidad a través de la fuerza de tu núcleo. Déjate hundir tan profundamente en este centro que el tiempo se disuelva, revelando tu naturaleza',
      'Muévete a tu centro del Corazón, en tu pecho. En la atemporalidad, el amor fluye libremente. Practica soltar; o si es necesario, sumérgete tan por completo en lo que sientes que el apego se libera por sí solo.',
      'Descansa en tu centro de Sabiduría, en tu frente. De la atemporalidad surge el verdadero saber. Ya sea mediante una liberación suave o una rendición completa, encuentra el espacio donde la sabiduría surge naturalmente.',
    ],
    pages: [
      { title: '', subtitle: '' },
      { title: 'Tres Centros Sagrados', subtitle: 0 },
      { title: 'Anillo del Poder', subtitle: 1 },
      { title: 'Anillo del Corazón', subtitle: 2 },
      { title: 'Anillo de la Sabiduría', subtitle: 3 },
      { title: '¿Listo para comenzar?', subtitle: 'Toca la pestaña Sesión a continuación para iniciar tu primera sesión. Elige tu duración y presiona Iniciar.' },
    ],
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
      description: 'Elige tu tema de apariencia preferido.',
    },
    dailyReminder: {
      enable: 'Activar recordatorio diario',
      hint: 'Activar notificación de recordatorio de sesión diaria',
      setTimeHint: 'Toca para cambiar la hora del recordatorio diario',
      enableToSetTime: 'Activar recordatorio diario para establecer la hora',
      description: 'Programar una notificación local (24 horas).',
      timePlaceholder: 'HH:MM',
      timeAccessibilityLabel: 'Hora del recordatorio diario',
      notSet: 'no establecida',
    },
    alerts: {
      testAlert: 'Probar alerta',
      chimeVolume: 'Volumen de la campana',
      description: 'Elige cómo te alerta la aplicación durante tu sesión.',
      playInBackground: 'Reproducir alertas en segundo plano',
      backgroundDescription: 'Las campanas y vibraciones siguen sonando si la aplicación está en segundo plano o la pantalla está bloqueada.',
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
    title: 'Explorar',
    accessibility: {
      explorePage: 'Página de recursos de exploración',
      openLink: 'Abre en el navegador',
    },
    links: {
      aboutCreator: 'Acerca del creador de esta aplicación',
      research: 'Investigación: Violencia íntima',
      newsletter: 'Boletín',
    },
  },

  // Common
  common: {
    loading: 'Cargando...',
  },

  // Notifications
  notifications: {
    sessionComplete: 'Sesión completa',
    sessionFinished: 'Sesión terminada',
    dailyReminderBody: '¿Listo para la sesión de hoy?',
    channelDefault: 'Predeterminado',
    channelSessionTimer: 'Temporizador de sesión',
  },

  // Tab Bar
  tabs: {
    home: 'Inicio',
    session: 'Sesión',
    settings: 'Configuración',
    explore: 'Explorar',
  },
} as const;
