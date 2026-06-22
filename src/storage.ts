import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Reminder } from './types'
import { seedReminders } from './data'

const KEY = 'cerca.reminders.v1'

/** Load persisted reminders, falling back to the seed on first run. */
export async function loadReminders(): Promise<Reminder[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if (raw == null) {
      const seed = seedReminders()
      await AsyncStorage.setItem(KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw) as Reminder[]
    if (!Array.isArray(parsed)) return seedReminders()
    return parsed
  } catch {
    return seedReminders()
  }
}

/** Persist the full reminder list. Fire-and-forget from the UI. */
export async function saveReminders(reminders: Reminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(reminders))
  } catch {
    // Storage failures shouldn't crash the app; the in-memory list still works.
  }
}
