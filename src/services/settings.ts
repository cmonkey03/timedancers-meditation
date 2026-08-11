/**
 * Settings service for centralized app settings management
 */
import { APP_NAME, STORAGE_KEYS } from '@/constants';
import type { AlertMode, AppSettings, DailyReminder } from '@/types';
import { cancelScheduledById, scheduleDailyReminder } from '@/utils/notifications';
import { storageService } from './storage';

class SettingsService {
  // ==================== Duration Settings ====================

  async getLastDurationMinutes(): Promise<string> {
    const value = await storageService.get(STORAGE_KEYS.LAST_DURATION_MINUTES);
    return value || '5';
  }

  async setLastDurationMinutes(minutes: string): Promise<void> {
    await storageService.set(STORAGE_KEYS.LAST_DURATION_MINUTES, minutes);
  }

  // ==================== Alert Settings ====================

  async getAlertMode(): Promise<AlertMode> {
    const value = await storageService.get<AlertMode>(STORAGE_KEYS.ALERT_MODE);
    if (value === 'chime' || value === 'chime_haptic' || value === 'haptic' || value === 'silent') {
      return value;
    }
    return 'chime'; // Default
  }

  async setAlertMode(mode: AlertMode): Promise<void> {
    await storageService.set(STORAGE_KEYS.ALERT_MODE, mode);
  }

  async getChimeVolume(): Promise<number> {
    const value = await storageService.get(STORAGE_KEYS.CHIME_VOLUME);
    if (value === null) return 0.7; // Default volume
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0.7 : Math.max(0, Math.min(1, parsed));
  }

  async setChimeVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await storageService.set(STORAGE_KEYS.CHIME_VOLUME, clampedVolume.toString());
  }

  async getAllowBackgroundAlerts(): Promise<boolean> {
    const value = await storageService.get(STORAGE_KEYS.ALLOW_BACKGROUND_ALERTS);
    return value === 'true';
  }

  async setAllowBackgroundAlerts(allow: boolean): Promise<void> {
    await storageService.set(STORAGE_KEYS.ALLOW_BACKGROUND_ALERTS, allow ? 'true' : 'false');
  }

  // ==================== Daily Reminder Settings ====================

  async getDailyReminder(): Promise<DailyReminder> {
    try {
      const [enabled, time, id] = await storageService.multiGet([
        STORAGE_KEYS.DAILY_REMINDER_ENABLED,
        STORAGE_KEYS.DAILY_REMINDER_TIME,
        STORAGE_KEYS.DAILY_REMINDER_ID,
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
    const existingId = await storageService.get(STORAGE_KEYS.DAILY_REMINDER_ID);
    if (existingId) {
      await cancelScheduledById(existingId);
      await storageService.remove(STORAGE_KEYS.DAILY_REMINDER_ID);
    }

    if (!enabled) {
      await storageService.set(STORAGE_KEYS.DAILY_REMINDER_ENABLED, 'false');
      return { enabled: false, time: '' };
    }

    // Schedule new one if time is valid
    const id = await scheduleDailyReminder(time, APP_NAME, 'Ready for today\'s session?');
    await storageService.set(STORAGE_KEYS.DAILY_REMINDER_ENABLED, 'true');
    await storageService.set(STORAGE_KEYS.DAILY_REMINDER_TIME, time);
    if (id) await storageService.set(STORAGE_KEYS.DAILY_REMINDER_ID, id);
    return { enabled: true, time, id: id || undefined };
  }

  // ==================== Session Settings ====================

  async getActiveSessionEndAtMs(): Promise<number | null> {
    const value = await storageService.get(STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS);
    if (!value) return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }

  async setActiveSessionEndAtMs(timestamp: number): Promise<void> {
    await storageService.set(STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS, timestamp.toString());
  }

  async clearActiveSessionEndAtMs(): Promise<void> {
    await storageService.remove(STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS);
  }

  // ==================== Theme Settings ====================

  async getThemeOverride(): Promise<'light' | 'dark' | null> {
    const value = await storageService.get<'light' | 'dark'>(STORAGE_KEYS.THEME_OVERRIDE);
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return null;
  }

  async setThemeOverride(theme: 'light' | 'dark' | null): Promise<void> {
    if (theme === null) {
      await storageService.remove(STORAGE_KEYS.THEME_OVERRIDE);
    } else {
      await storageService.set(STORAGE_KEYS.THEME_OVERRIDE, theme);
    }
  }

  // ==================== Onboarding Settings ====================

  async hasCompletedOnboarding(): Promise<boolean> {
    const value = await storageService.get(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  }

  async setOnboardingCompleted(): Promise<void> {
    await storageService.set(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  }

  // ==================== Locale Settings ====================

  async getLocale(): Promise<string | null> {
    const value = await storageService.get(STORAGE_KEYS.APP_LOCALE);
    return value;
  }

  async setLocale(locale: string): Promise<void> {
    await storageService.set(STORAGE_KEYS.APP_LOCALE, locale);
  }

  // ==================== Bulk Operations ====================

  /**
   * Reset all settings to defaults
   */
  async resetToDefaults(): Promise<void> {
    await storageService.multiRemove([
      STORAGE_KEYS.LAST_DURATION_MINUTES,
      STORAGE_KEYS.ALERT_MODE,
      STORAGE_KEYS.CHIME_VOLUME,
      STORAGE_KEYS.ALLOW_BACKGROUND_ALERTS,
      STORAGE_KEYS.DAILY_REMINDER_ENABLED,
      STORAGE_KEYS.DAILY_REMINDER_TIME,
      STORAGE_KEYS.DAILY_REMINDER_ID,
      STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS,
      STORAGE_KEYS.THEME_OVERRIDE,
    ]);
  }

  /**
   * Get all settings as a single object
   */
  async getAllSettings(): Promise<Partial<AppSettings>> {
    const settings = await storageService.multiGet([
      STORAGE_KEYS.LAST_DURATION_MINUTES,
      STORAGE_KEYS.ALERT_MODE,
      STORAGE_KEYS.CHIME_VOLUME,
      STORAGE_KEYS.ALLOW_BACKGROUND_ALERTS,
      STORAGE_KEYS.DAILY_REMINDER_ENABLED,
      STORAGE_KEYS.DAILY_REMINDER_TIME,
      STORAGE_KEYS.DAILY_REMINDER_ID,
      STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS,
      STORAGE_KEYS.THEME_OVERRIDE,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    ]);

    const obj: Record<string, string | null> = {};
    settings.forEach(([key, value]) => {
      obj[key] = value;
    });

    return {
      lastDurationMinutes: obj[STORAGE_KEYS.LAST_DURATION_MINUTES] || '5',
      alertMode: (obj[STORAGE_KEYS.ALERT_MODE] as AlertMode) || 'chime',
      chimeVolume: obj[STORAGE_KEYS.CHIME_VOLUME] ? parseFloat(obj[STORAGE_KEYS.CHIME_VOLUME]!) : 0.7,
      allowBackgroundAlerts: obj[STORAGE_KEYS.ALLOW_BACKGROUND_ALERTS] === 'true',
      dailyReminderEnabled: obj[STORAGE_KEYS.DAILY_REMINDER_ENABLED] === 'true',
      dailyReminderTime: obj[STORAGE_KEYS.DAILY_REMINDER_TIME] || '',
      dailyReminderId: obj[STORAGE_KEYS.DAILY_REMINDER_ID] || null,
      activeSessionEndAtMs: obj[STORAGE_KEYS.ACTIVE_SESSION_END_AT_MS] || null,
      themeOverride: (obj[STORAGE_KEYS.THEME_OVERRIDE] as 'light' | 'dark' | null) || null,
      onboardingCompleted: obj[STORAGE_KEYS.ONBOARDING_COMPLETED] === 'true',
    };
  }
}

export const settingsService = new SettingsService();