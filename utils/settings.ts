import { cancelScheduledById, scheduleDailyReminder } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  reminderEnabled: 'dailyReminderEnabled',
  reminderTime: 'dailyReminderTime',
  reminderId: 'dailyReminderId',
  chimeVolume: 'chimeVolume',
} as const;

export type DailyReminder = {
  enabled: boolean;
  time: string; // HH:MM
  id?: string | null;
};

export async function getDailyReminder(): Promise<DailyReminder> {
  try {
    const [en, time, id] = await Promise.all([
      AsyncStorage.getItem(KEYS.reminderEnabled),
      AsyncStorage.getItem(KEYS.reminderTime),
      AsyncStorage.getItem(KEYS.reminderId),
    ]);
    return {
      enabled: en === 'true',
      time: time || '',
      id: id || undefined,
    };
  } catch {
    return { enabled: false, time: '' };
  }
}

export async function setDailyReminderEnabled(enabled: boolean, time: string): Promise<DailyReminder> {
  // Cancel any existing scheduled reminder
  const existingId = await AsyncStorage.getItem(KEYS.reminderId);
  if (existingId) {
    await cancelScheduledById(existingId);
    await AsyncStorage.removeItem(KEYS.reminderId);
  }

  if (!enabled) {
    await AsyncStorage.setItem(KEYS.reminderEnabled, 'false');
    return { enabled: false, time: '' };
  }

  // schedule new one if time is valid
  const id = await scheduleDailyReminder(time, 'Timedancers', 'Time to meditate');
  await AsyncStorage.setItem(KEYS.reminderEnabled, 'true');
  await AsyncStorage.setItem(KEYS.reminderTime, time);
  if (id) await AsyncStorage.setItem(KEYS.reminderId, id);
  return { enabled: true, time, id: id || undefined };
}

/**
 * Get the chime volume setting (0.0 to 1.0)
 */
export async function getChimeVolume(): Promise<number> {
  try {
    const volume = await AsyncStorage.getItem(KEYS.chimeVolume);
    if (volume === null) return 0.7; // Default volume
    const parsed = parseFloat(volume);
    return isNaN(parsed) ? 0.7 : Math.max(0, Math.min(1, parsed));
  } catch {
    return 0.7; // Default volume
  }
}

/**
 * Set the chime volume (0.0 to 1.0)
 */
export async function setChimeVolume(volume: number): Promise<void> {
  try {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await AsyncStorage.setItem(KEYS.chimeVolume, clampedVolume.toString());
  } catch {
    // Ignore storage errors
  }
}
