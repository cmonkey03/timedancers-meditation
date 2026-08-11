/**
 * Centralized type definitions for the Timewheel app
 */

// ==================== Timer & Session Types ====================

export type PhaseKey = "power" | "heart" | "wisdom";

export interface Phase {
  key: PhaseKey;
  seconds: number;
}

export interface TimerState {
  phases: Phase[];
  startAt: number | null;    // epoch ms, when session started
  pauseAt: number | null;    // epoch ms, when last paused
  pausedTotal: number;       // total paused ms
  running: boolean;
}

export interface TimerNow {
  done: boolean;
  currentIndex: number;
  currentKey: PhaseKey | null;
  phaseRemainingMs: number;
  totalRemainingMs: number;
}

export interface UsePhasedTimerState {
  now: TimerNow;
  running: boolean;
  started: boolean;
  phases: Phase[];
  startAtMs: number | null;
  pausedTotalMs: number;
}

// ==================== Alert & Notification Types ====================

export type AlertMode = 'chime' | 'chime_haptic' | 'haptic' | 'silent';

export type ChimeEvent = 'sessionStart' | 'phase1to2' | 'phase2to3' | 'sessionComplete';

// ==================== Settings Types ====================

export interface DailyReminder {
  enabled: boolean;
  time: string; // HH:MM
  id?: string | null;
}

export interface AppSettings {
  lastDurationMinutes: string;
  alertMode: AlertMode;
  chimeVolume: number;
  allowBackgroundAlerts: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  dailyReminderId: string | null;
  activeSessionEndAtMs: string | null;
  themeOverride: 'light' | 'dark' | null;
  onboardingCompleted: boolean;
}

// ==================== Theme Types ====================

export type ThemeMode = 'light' | 'dark';

export interface AppColors {
  // Core colors
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  
  // Text colors
  text: string;
  textInverse: string;
  mutedText: string;
  
  // UI elements
  border: string;
  divider: string;
  
  // Button colors
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonGhost: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Shadow
  shadow: string;
  
  // Opacity helpers
  text30: string;
  text40: string;
  text60: string;
}

export interface ThemeColors {
  light: AppColors;
  dark: AppColors;
}

// ==================== Component Types ====================

export interface RingState {
  state: "idle" | "active" | "releasing" | "done";
  size: number;
  label: string;
  remaining: number;
  total: number;
  colors: [string, string];
  accessibilityLabel: string;
}

// ==================== Hook Types ====================

export interface ChimeContextValue {
  playStartAlert: () => Promise<void>;
  playCompletionAlert: () => Promise<void>;
  triggerChime: (event: ChimeEvent) => Promise<void>;
  resetChimeState: () => void;
  setMode: (mode: AlertMode) => void;
  updateVolume: (volume: number) => void;
  volume: number;
  mode: AlertMode;
}

export interface NotificationServiceValue {
  scheduleNotificationsForRemaining: () => Promise<void>;
  markSessionStart: () => Promise<void>;
  clearSessionToken: () => Promise<void>;
  coldStartCleanup: () => Promise<void>;
}

// ==================== Utility Types ====================

export type AsyncStorageKey = 
  | 'lastDurationMinutes'
  | 'alertMode'
  | 'chimeVolume'
  | 'allowBackgroundAlerts'
  | 'dailyReminderEnabled'
  | 'dailyReminderTime'
  | 'dailyReminderId'
  | 'activeSessionEndAtMs'
  | 'themeOverride'
  | 'onboardingCompleted';
