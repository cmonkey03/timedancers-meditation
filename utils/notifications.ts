import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Initialize notifications: request permissions and create Android channel
export async function initNotifications() {
  // iOS: request permissions
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowBadge: true,
        allowSound: true,
        allowAlert: true,
      },
    });
  }

  // Android: create channel with sound
  if (Platform.OS === 'android') {
    // Ensure the default channel has sound, since some triggers (calendar) use it implicitly
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
    // Also create an explicit channel we can target for time-interval triggers
    await Notifications.setNotificationChannelAsync('meditation-timer-v2', {
      name: 'Meditation Timer',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }


  // Foreground behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      // Newer iOS behaviors
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export type ScheduledId = string;

export async function cancelAllScheduled() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export async function scheduleAfterMs(
  msFromNow: number,
  title: string,
  body?: string,
  opts?: { withSound?: boolean }
): Promise<ScheduledId | null> {
  if (msFromNow <= 0) return null;
  try {
    const seconds = Math.ceil(msFromNow / 1000);
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
      channelId: Platform.OS === 'android' ? 'meditation-timer-v2' : undefined,
    } as Notifications.TimeIntervalTriggerInput;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        // iOS: boolean true; Android uses channel sound config
        sound: opts?.withSound === false ? undefined : (Platform.OS === 'ios' ? true : undefined),
      },
      trigger,
    });
    return id;
  } catch {
    return null;
  }
}

// Schedule a daily reminder at local time HH:MM (24-hour)
export async function scheduleDailyReminder(
  hhmm: string,
  title: string,
  body?: string
): Promise<ScheduledId | null> {
  try {
    const m = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(hhmm)?.slice(1) ?? null;
    if (!m) return null;
    const hours = parseInt(m[0], 10);
    const minutes = parseInt(m[1], 10);
    const trigger: Notifications.CalendarTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hours,
      minute: minutes,
      repeats: true,
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: Platform.OS === 'ios' ? true : undefined,
      },
      trigger,
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelScheduledById(id: ScheduledId | null | undefined) {
  try {
    if (!id) return;
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
}

// Schedule at an absolute time by delegating to a time-interval trigger.
// This avoids Calendar typing/runtime incompatibilities while achieving the same effect.
export async function scheduleAtMs(
  whenEpochMs: number,
  title: string,
  body?: string,
  opts?: { withSound?: boolean }
): Promise<ScheduledId | null> {
  const delta = whenEpochMs - Date.now();
  return scheduleAfterMs(delta, title, body, opts);
}
