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
    await Notifications.setNotificationChannelAsync('meditation-timer', {
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
      channelId: Platform.OS === 'android' ? 'meditation-timer' : undefined,
    } as Notifications.TimeIntervalTriggerInput;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: opts?.withSound === false ? undefined : (Platform.select({ ios: 'default', android: 'default' }) as any),
      },
      trigger,
    });
    return id;
  } catch {
    return null;
  }
}

// Schedule at an absolute wall-clock time (epoch ms)
export async function scheduleAtMs(
  whenEpochMs: number,
  title: string,
  body?: string,
  opts?: { withSound?: boolean }
): Promise<ScheduledId | null> {
  try {
    if (whenEpochMs <= Date.now()) return null;
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      date: new Date(whenEpochMs),
      repeats: false,
    } as Notifications.CalendarTriggerInput;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: opts?.withSound === false ? undefined : (Platform.select({ ios: 'default', android: 'default' }) as any),
      },
      trigger,
    });
    return id;
  } catch {
    return null;
  }
}
