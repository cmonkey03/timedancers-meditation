import { cancelScheduledById, scheduleDailyReminder } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  reminderEnabled: 'dailyReminderEnabled',
  reminderTime: 'dailyReminderTime',
  reminderId: 'dailyReminderId',
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
