import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder, cancelScheduledById } from '@/utils/notifications';

export type PhaseSeconds = {
  power?: number; // seconds
  heart?: number;
  wisdom?: number;
};

const KEYS = {
  phasePower: 'phaseSeconds.power',
  phaseHeart: 'phaseSeconds.heart',
  phaseWisdom: 'phaseSeconds.wisdom',
  reminderEnabled: 'dailyReminderEnabled',
  reminderTime: 'dailyReminderTime',
  reminderId: 'dailyReminderId',
} as const;

export async function getPhaseSeconds(): Promise<PhaseSeconds> {
  try {
    const [p, h, w] = await Promise.all([
      AsyncStorage.getItem(KEYS.phasePower),
      AsyncStorage.getItem(KEYS.phaseHeart),
      AsyncStorage.getItem(KEYS.phaseWisdom),
    ]);
    const out: PhaseSeconds = {};
    if (p) out.power = parseInt(p, 10);
    if (h) out.heart = parseInt(h, 10);
    if (w) out.wisdom = parseInt(w, 10);
    return out;
  } catch {
    return {};
  }
}

export async function setPhaseSeconds(partial: PhaseSeconds): Promise<void> {
  const ops: Promise<any>[] = [];
  if (partial.power == null) {
    ops.push(AsyncStorage.removeItem(KEYS.phasePower));
  } else {
    ops.push(AsyncStorage.setItem(KEYS.phasePower, String(partial.power)));
  }
  if (partial.heart == null) {
    ops.push(AsyncStorage.removeItem(KEYS.phaseHeart));
  } else {
    ops.push(AsyncStorage.setItem(KEYS.phaseHeart, String(partial.heart)));
  }
  if (partial.wisdom == null) {
    ops.push(AsyncStorage.removeItem(KEYS.phaseWisdom));
  } else {
    ops.push(AsyncStorage.setItem(KEYS.phaseWisdom, String(partial.wisdom)));
  }
  await Promise.all(ops);
}

export async function clearPhaseSeconds(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.phasePower,
    KEYS.phaseHeart,
    KEYS.phaseWisdom,
  ]);
}

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
