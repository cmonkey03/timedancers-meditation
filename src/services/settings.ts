/**
 * Settings service for centralized app settings management
 */
import { cancelScheduledById, scheduleDailyReminder } from '@/utils/notifications';
import { storageService } from './storage';
import type { AlertMode, DailyReminder, AppSettings } from '@/types';

const STORAGE_KEYS = {
  lastDurationMinutes: 'lastDurationMinutes' as const,
  alertMode: 'alertMode' as const,
  chimeVolume: 'chimeVolume' as const,
  allowBackgroundAlerts: 'allowBackgroundAlerts' as const,
  dailyReminderEnabled: 'dailyReminderEnabled' as const,
  dailyReminderTime: 'dailyReminderTime' as const,
  dailyReminderId: 'dailyReminderId' as const,
  activeSessionEndAtMs: 'activeSessionEndAtMs' as const,
  themeOverride: 'themeOverride' as const,
  onboardingCompleted: 'onboardingCompleted' as const,
};

class SettingsService {
  // ==================== Duration Settings ====================

  async getLastDurationMinutes(): Promise<string> {
    const value = await storageService.get(STORAGE_KEYS.lastDurationMinutes);
    return value || '5';
  }

  async setLastDurationMinutes(minutes: string): Promise<void> {
    await storageService.set(STORAGE_KEYS.lastDurationMinutes, minutes);
  }

  // ==================== Alert Settings ====================

  async getAlertMode(): Promise<AlertMode> {
    const value = await storageService.get<AlertMode>(STORAGE_KEYS.alertMode);
    if (value === 'chime' || value === 'chime_haptic' || value === 'haptic' || value === 'silent') {
      return value;
    }
    return 'chime'; // Default
  }

  async setAlertMode(mode: AlertMode): Promise<void> {
    await storageService.set(STORAGE_KEYS.alertMode, mode);
  }

  async getChimeVolume(): Promise<number> {
    const value = await storageService.get(STORAGE_KEYS.chimeVolume);
    if (value === null) return 0.7; // Default volume
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0.7 : Math.max(0, Math.min(1, parsed));
  }

  async setChimeVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await storageService.set(STORAGE_KEYS.chimeVolume, clampedVolume.toString());
  }

  async getAllowBackgroundAlerts(): Promise<boolean> {
    const value = await storageService.get(STORAGE_KEYS.allowBackgroundAlerts);
    return value === 'true';
  }

  async setAllowBackgroundAlerts(allow: boolean): Promise<void> {
    await storageService.set(STORAGE_KEYS.allowBackgroundAlerts, allow ? 'true' : 'false');
  }

  // ==================== Daily Reminder Settings ====================

  async getDailyReminder(): Promise<DailyReminder> {
    try {
      const [enabled, time, id] = await storageService.multiGet([
        STORAGE_KEYS.dailyReminderEnabled,
        STORAGE_KEYS.dailyReminderTime,
        STORAGE_KEYS.dailyReminderId,
      ]);
      return {
        enabled: enabled[1] === 'true',
        time: time[1] || '',
        id: id[1] || undefined,
      };
    } catch {
      return { enabled: false, time: '' };
    }
  }

  async setDailyReminderEnabled(enabled: boolean, time: string): Promise<DailyReminder> {
    // Cancel any existing scheduled reminder
    const existingId = await storageService.get(STORAGE_KEYS.dailyReminderId);
    if (existingId) {
      await cancelScheduledById(existingId);
      await storageService.remove(STORAGE_KEYS.dailyReminderId);
    }

    if (!enabled) {
      await storageService.set(STORAGE_KEYS.dailyReminderEnabled, 'false');
      return { enabled: false, time: '' };
    }

    // Schedule new one if time is valid
    const id = await scheduleDailyReminder(time, 'Timespin', 'Ready for today\'s session?');
    await storageService.set(STORAGE_KEYS.dailyReminderEnabled, 'true');
    await storageService.set(STORAGE_KEYS.dailyReminderTime, time);
    if (id) await storageService.set(STORAGE_KEYS.dailyReminderId, id);
    return { enabled: true, time, id: id || undefined };
  }

  // ==================== Session Settings ====================

  async getActiveSessionEndAtMs(): Promise<number | null> {
    const value = await storageService.get(STORAGE_KEYS.activeSessionEndAtMs);
    if (!value) return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }

  async setActiveSessionEndAtMs(timestamp: number): Promise<void> {
    await storageService.set(STORAGE_KEYS.activeSessionEndAtMs, timestamp.toString());
  }

  async clearActiveSessionEndAtMs(): Promise<void> {
    await storageService.remove(STORAGE_KEYS.activeSessionEndAtMs);
  }

  // ==================== Theme Settings ====================

  async getThemeOverride(): Promise<'light' | 'dark' | null> {
    const value = await storageService.get<'light' | 'dark'>(STORAGE_KEYS.themeOverride);
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return null;
  }

  async setThemeOverride(theme: 'light' | 'dark' | null): Promise<void> {
    if (theme === null) {
      await storageService.remove(STORAGE_KEYS.themeOverride);
    } else {
      await storageService.set(STORAGE_KEYS.themeOverride, theme);
    }
  }

  // ==================== Onboarding Settings ====================

  async hasCompletedOnboarding(): Promise<boolean> {
    const value = await storageService.get(STORAGE_KEYS.onboardingCompleted);
    return value === 'true';
  }

  async setOnboardingCompleted(): Promise<void> {
    await storageService.set(STORAGE_KEYS.onboardingCompleted, 'true');
  }

  // ==================== Bulk Operations ====================

  /**
   * Reset all settings to defaults
   */
  async resetToDefaults(): Promise<void> {
    await storageService.multiRemove([
      STORAGE_KEYS.lastDurationMinutes,
      STORAGE_KEYS.alertMode,
      STORAGE_KEYS.chimeVolume,
      STORAGE_KEYS.allowBackgroundAlerts,
      STORAGE_KEYS.dailyReminderEnabled,
      STORAGE_KEYS.dailyReminderTime,
      STORAGE_KEYS.dailyReminderId,
      STORAGE_KEYS.activeSessionEndAtMs,
      STORAGE_KEYS.themeOverride,
    ]);
  }

  /**
   * Get all settings as a single object
   */
  async getAllSettings(): Promise<Partial<AppSettings>> {
    const settings = await storageService.multiGet([
      STORAGE_KEYS.lastDurationMinutes,
      STORAGE_KEYS.alertMode,
      STORAGE_KEYS.chimeVolume,
      STORAGE_KEYS.allowBackgroundAlerts,
      STORAGE_KEYS.dailyReminderEnabled,
      STORAGE_KEYS.dailyReminderTime,
      STORAGE_KEYS.dailyReminderId,
      STORAGE_KEYS.activeSessionEndAtMs,
      STORAGE_KEYS.themeOverride,
      STORAGE_KEYS.onboardingCompleted,
    ]);

    const obj: Record<string, string | null> = {};
    settings.forEach(([key, value]) => {
      obj[key] = value;
    });

    return {
      lastDurationMinutes: obj[STORAGE_KEYS.lastDurationMinutes] || '5',
      alertMode: (obj[STORAGE_KEYS.alertMode] as AlertMode) || 'chime',
      chimeVolume: obj[STORAGE_KEYS.chimeVolume] ? parseFloat(obj[STORAGE_KEYS.chimeVolume]) : 0.7,
      allowBackgroundAlerts: obj[STORAGE_KEYS.allowBackgroundAlerts] === 'true',
      dailyReminderEnabled: obj[STORAGE_KEYS.dailyReminderEnabled] === 'true',
      dailyReminderTime: obj[STORAGE_KEYS.dailyReminderTime] || '',
      dailyReminderId: obj[STORAGE_KEYS.dailyReminderId] || null,
      activeSessionEndAtMs: obj[STORAGE_KEYS.activeSessionEndAtMs] || null,
      themeOverride: (obj[STORAGE_KEYS.themeOverride] as 'light' | 'dark' | null) || null,
      onboardingCompleted: obj[STORAGE_KEYS.onboardingCompleted] === 'true',
    };
  }
}

export const settingsService = new SettingsService();