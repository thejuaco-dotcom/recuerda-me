import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import type { Reminder } from './types'

// Foreground behaviour: still surface the banner so a reminder firing while
// you're in the app doesn't go unnoticed.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

let configured = false

/** Set up the Android channel once. Safe to call repeatedly. */
export async function configureNotifications(): Promise<void> {
  if (configured) return
  configured = true
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('cerca', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 120, 200],
      lightColor: '#A7D8B6',
    })
  }
}

/** Ask for notification permission. Returns whether it was granted. */
export async function ensurePermissions(): Promise<boolean> {
  if (!Device.isDevice) return false
  const current = await Notifications.getPermissionsAsync()
  if (current.granted) return true
  if (!current.canAskAgain) return false
  const next = await Notifications.requestPermissionsAsync()
  return next.granted
}

/**
 * Schedule the OS notification for a reminder with a future due time.
 * Returns the scheduled id (to store on the reminder) or null if nothing
 * was scheduled (no due time, or it's already in the past).
 */
export async function scheduleReminderNotification(reminder: Reminder): Promise<string | null> {
  if (reminder.done || reminder.dueAt == null) return null
  const fireDate = new Date(reminder.dueAt)
  if (fireDate.getTime() <= Date.now() + 1000) return null

  const granted = await ensurePermissions()
  if (!granted) return null

  return Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.insist ? 'Sigo aquí, sin prisa' : 'Cerca · recordatorio',
      body: reminder.text,
      data: { reminderId: reminder.id },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireDate,
      channelId: 'cerca',
    },
  })
}

/** Cancel a previously scheduled notification, if any. */
export async function cancelReminderNotification(notifId: string | null): Promise<void> {
  if (!notifId) return
  try {
    await Notifications.cancelScheduledNotificationAsync(notifId)
  } catch {
    // Already fired or cancelled — nothing to do.
  }
}
