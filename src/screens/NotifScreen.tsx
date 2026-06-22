import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { HoldRing } from '../components/HoldRing'
import { colors, fonts } from '../theme'
import type { Reminder } from '../types'

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

interface Props {
  reminder: Reminder
  onConfirm: (id: string) => void
  onSnooze: (id: string) => void
  onDismiss: () => void
}

export function NotifScreen({ reminder, onConfirm, onSnooze, onDismiss }: Props) {
  const [done, setDone] = useState(reminder.done)

  const when = reminder.dueAt ? new Date(reminder.dueAt) : new Date()
  const dateStr = `${DAYS[when.getDay()]} ${when.getDate()} de ${MONTHS[when.getMonth()]}`
  const timeStr = `${when.getHours().toString().padStart(2, '0')}:${when.getMinutes().toString().padStart(2, '0')}`

  const complete = () => {
    setDone(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    onConfirm(reminder.id)
    setTimeout(onDismiss, 1100)
  }

  return (
    <LinearGradient colors={[colors.bgDeep, colors.bgDeep2]} style={StyleSheet.absoluteFill}>
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 84, paddingBottom: 46 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: '#8A938F' }}>{dateStr}</Text>
          <Text style={{ fontSize: 72, fontWeight: '300', letterSpacing: -2, color: colors.text, marginTop: 6 }}>
            {timeStr}
          </Text>
        </View>

        <View
          style={{
            marginTop: 'auto',
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.10)',
            borderRadius: 26,
            padding: 22,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                backgroundColor: colors.green,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.bg }} />
            </View>
            <Text style={{ fontSize: 13, color: colors.muted, fontFamily: fonts.sansSemi, flex: 1 }}>
              CERCA · RECORDATORIO
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted2 }}>ahora</Text>
          </View>

          <Text style={{ fontFamily: fonts.serifItalic, fontSize: 13, color: colors.green, marginTop: 16 }}>
            sigo aquí, sin prisa
          </Text>
          <Text style={{ fontSize: 23, fontFamily: fonts.sansSemi, color: colors.text, marginTop: 4 }}>
            {reminder.text}
          </Text>
          <Text style={{ fontSize: 14, color: '#8A938F', marginTop: 8, lineHeight: 20 }}>
            {done
              ? '¡hecho! gracias por cerrarlo.'
              : 'te lo recordé varias veces · no se irá del todo hasta que confirmes.'}
          </Text>

          <View style={{ alignItems: 'center', gap: 12, marginTop: 22 }}>
            <HoldRing done={done} onComplete={complete} />
            <Text style={{ fontSize: 15, color: colors.green, fontFamily: fonts.sansSemi }}>
              {done ? '¡hecho!' : 'mantén para confirmar'}
            </Text>
          </View>

          {!done && (
            <Pressable onPress={() => onSnooze(reminder.id)} style={{ marginTop: 18 }}>
              <Text style={{ textAlign: 'center', fontSize: 15, color: '#8A938F' }}>recuérdamelo en 10 min</Text>
            </Pressable>
          )}
        </View>
      </View>
    </LinearGradient>
  )
}
