import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Notifications from 'expo-notifications'
import { useFonts } from 'expo-font'
import { Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader/400Regular_Italic'
import { Newsreader_500Medium_Italic } from '@expo-google-fonts/newsreader/500Medium_Italic'
import { HankenGrotesk_400Regular } from '@expo-google-fonts/hanken-grotesk/400Regular'
import { HankenGrotesk_500Medium } from '@expo-google-fonts/hanken-grotesk/500Medium'
import { HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk/600SemiBold'
import { HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk/700Bold'

import { HomeScreen } from './src/screens/HomeScreen'
import { ContextScreen } from './src/screens/ContextScreen'
import { CaptureScreen } from './src/screens/CaptureScreen'
import { NotifScreen } from './src/screens/NotifScreen'
import { META, ORDER } from './src/data'
import { parseDraft } from './src/parseDraft'
import { loadReminders, saveReminders } from './src/storage'
import {
  cancelReminderNotification,
  configureNotifications,
  ensurePermissions,
  scheduleReminderNotification,
} from './src/notifications'
import { colors } from './src/theme'
import type { ContextId, Reminder } from './src/types'

type Screen = 'home' | 'context' | 'capture'

function humanizeDue(dueAt: number): string {
  const d = new Date(dueAt)
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (sameDay) return `hoy ${hh}:${mm}`
  if (d.toDateString() === tomorrow.toDateString()) return `mañana ${hh}:${mm}`
  return `${d.getDate()}/${d.getMonth() + 1} ${hh}:${mm}`
}

function Root() {
  const insets = useSafeAreaInsets()

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [ready, setReady] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')
  const [activeId, setActiveId] = useState<ContextId>('casa')
  const [notifReminderId, setNotifReminderId] = useState<string | null>(null)

  // ── Boot: load data, set up notifications ────────────────────────────────
  useEffect(() => {
    let mounted = true
    ;(async () => {
      await configureNotifications()
      ensurePermissions()
      const data = await loadReminders()
      if (mounted) {
        setReminders(data)
        setReady(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Tapping a delivered notification opens the in-app confirm for it.
  const remindersRef = useRef(reminders)
  remindersRef.current = reminders
  useEffect(() => {
    const open = (id?: string) => {
      if (id && remindersRef.current.some((r) => r.id === id)) setNotifReminderId(id)
    }
    Notifications.getLastNotificationResponseAsync().then((res) => {
      open(res?.notification.request.content.data?.reminderId as string | undefined)
    })
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      open(res.notification.request.content.data?.reminderId as string | undefined)
    })
    return () => sub.remove()
  }, [])

  // ── Mutations ────────────────────────────────────────────────────────────
  const persist = (next: Reminder[]) => {
    setReminders(next)
    saveReminders(next)
  }

  const addReminder = async (text: string, dueAt: number | null) => {
    const p = parseDraft(text)
    const baseTrigger = dueAt ? humanizeDue(dueAt) : p.trigger
    const draft: Reminder = {
      id: 'n' + Date.now(),
      contextId: p.ctx,
      text,
      trigger: p.insist ? `${baseTrigger} · insiste` : baseTrigger,
      loc: !!p.loc,
      insist: p.insist,
      done: false,
      createdAt: Date.now(),
      dueAt,
      notifId: null,
    }
    const notifId = await scheduleReminderNotification(draft)
    setReminders((prev) => {
      const next = [{ ...draft, notifId }, ...prev]
      saveReminders(next)
      return next
    })
    setScreen('home')
  }

  const toggleDone = (id: string) => {
    const target = reminders.find((r) => r.id === id)
    if (!target) return
    const nowDone = !target.done
    if (nowDone) cancelReminderNotification(target.notifId)
    persist(reminders.map((r) => (r.id === id ? { ...r, done: nowDone, notifId: nowDone ? null : r.notifId } : r)))
    if (!nowDone && target.dueAt) {
      scheduleReminderNotification({ ...target, done: false }).then((notifId) => {
        setReminders((cur) => {
          const next = cur.map((r) => (r.id === id ? { ...r, notifId } : r))
          saveReminders(next)
          return next
        })
      })
    }
  }

  const markDone = (id: string) => {
    const target = reminders.find((r) => r.id === id)
    if (!target) return
    cancelReminderNotification(target.notifId)
    persist(reminders.map((r) => (r.id === id ? { ...r, done: true, notifId: null } : r)))
  }

  const deleteReminder = (id: string) => {
    const target = reminders.find((r) => r.id === id)
    if (target) cancelReminderNotification(target.notifId)
    persist(reminders.filter((r) => r.id !== id))
  }

  const snooze = (id: string) => {
    const target = reminders.find((r) => r.id === id)
    if (!target) return
    cancelReminderNotification(target.notifId)
    const dueAt = Date.now() + 10 * 60 * 1000
    scheduleReminderNotification({ ...target, dueAt, done: false }).then((notifId) => {
      setReminders((cur) => {
        const next = cur.map((r) => (r.id === id ? { ...r, dueAt, done: false, notifId } : r))
        saveReminders(next)
        return next
      })
    })
    setNotifReminderId(null)
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.green} />
      </View>
    )
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const counts = ORDER.reduce(
    (acc, id) => {
      acc[id] = reminders.filter((r) => r.contextId === id && !r.done).length
      return acc
    },
    {} as Record<ContextId, number>,
  )
  const totalCount = ORDER.reduce((n, id) => n + counts[id], 0)

  const nu = reminders.find((r) => r.contextId === 'casa' && !r.done)
  const nextUp = nu
    ? { text: nu.text, trigger: (nu.trigger || '').replace(' · insiste', ''), onDone: () => toggleDone(nu.id) }
    : null

  const alerts = reminders.filter((r) => r.insist && !r.done)
  const activeReminders = reminders.filter((r) => r.contextId === activeId)
  const notifReminder = notifReminderId ? reminders.find((r) => r.id === notifReminderId) : undefined

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />

      {screen === 'home' && (
        <HomeScreen
          topInset={insets.top}
          alertsCount={alerts.length}
          onOpenAlerts={() => alerts[0] && setNotifReminderId(alerts[0].id)}
          nextUp={nextUp}
          counts={counts}
          totalCount={totalCount}
          onOpenContext={(id) => {
            setActiveId(id)
            setScreen('context')
          }}
          onOpenCapture={() => setScreen('capture')}
        />
      )}

      {screen === 'context' && (
        <ContextScreen
          topInset={insets.top}
          label={META[activeId].label}
          reminders={activeReminders}
          onBack={() => setScreen('home')}
          onToggle={toggleDone}
          onDelete={deleteReminder}
          onOpenCapture={() => setScreen('capture')}
        />
      )}

      {screen === 'capture' && (
        <CaptureScreen topInset={insets.top} onCancel={() => setScreen('home')} onSave={addReminder} />
      )}

      {notifReminder && (
        <NotifScreen
          reminder={notifReminder}
          onConfirm={markDone}
          onSnooze={snooze}
          onDismiss={() => setNotifReminderId(null)}
        />
      )}
    </View>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Newsreader_400Regular_Italic,
    Newsreader_500Medium_Italic,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  })

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />
  }

  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  )
}
