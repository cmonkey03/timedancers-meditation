/**
 * @deprecated Use settingsService from '@/services/settings' instead
 * This file is kept for backwards compatibility
 */
import { settingsService } from '@/services/settings';
import type { DailyReminder } from '@/types';

export async function getDailyReminder(): Promise<DailyReminder> {
  return settingsService.getDailyReminder();
}

export async function setDailyReminderEnabled(enabled: boolean, time: string, body?: string): Promise<DailyReminder> {
  return settingsService.setDailyReminderEnabled(enabled, time, body);
}

/**
 * Get the chime volume setting (0.0 to 1.0)
 */
export async function getChimeVolume(): Promise<number> {
  return settingsService.getChimeVolume();
}

/**
 * Set the chime volume (0.0 to 1.0)
 */
export async function setChimeVolume(volume: number): Promise<void> {
  return settingsService.setChimeVolume(volume);
}

/**
 * Check if the user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  return settingsService.hasCompletedOnboarding();
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  return settingsService.setOnboardingCompleted();
}