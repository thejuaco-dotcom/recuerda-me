import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { CheckIcon, ChevronLeft } from '../icons'
import { colors, fonts } from '../theme'
import type { Reminder } from '../types'

interface Props {
  topInset: number
  label: string
  reminders: Reminder[]
  onBack: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onOpenCapture: () => void
}

function accentOf(r: Reminder): string {
  if (r.insist) return colors.amber
  if (r.loc) return colors.green
  return colors.muted
}

export function ContextScreen({ topInset, label, reminders, onBack, onToggle, onDelete, onOpenCapture }: Props) {
  const confirmDelete = (r: Reminder) =>
    Alert.alert('Borrar recordatorio', `"${r.text}"`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => onDelete(r.id) },
    ])

  return (
    <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: topInset + 16, paddingBottom: 44 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={14} color={colors.textDim} />
        </Pressable>
        <View>
          <Text style={{ fontSize: 11, letterSpacing: 1.5, color: colors.muted2, fontFamily: fonts.sansBold }}>
            CONTEXTO
          </Text>
          <Text style={{ fontFamily: fonts.serifItalic, fontSize: 30, color: colors.text }}>{label}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, marginTop: 26 }} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
        {reminders.length === 0 && (
          <Text style={{ color: colors.faint, fontSize: 15, marginTop: 8 }}>
            Nada por aquí todavía. Añade algo abajo.
          </Text>
        )}
        {reminders.map((rem) => {
          const accent = accentOf(rem)
          return (
            <Pressable
              key={rem.id}
              onPress={() => onToggle(rem.id)}
              onLongPress={() => confirmDelete(rem)}
              delayLongPress={350}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 14,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.hairlineSoft,
                borderRadius: 18,
                paddingVertical: 15,
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  marginTop: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: rem.done ? colors.green : 'rgba(255,255,255,0.25)',
                  backgroundColor: rem.done ? colors.green : 'transparent',
                }}
              >
                {rem.done && <CheckIcon size={14} color={colors.greenInk} />}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    color: rem.done ? colors.faint : colors.text,
                    textDecorationLine: rem.done ? 'line-through' : 'none',
                  }}
                >
                  {rem.text}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: accent,
                      opacity: rem.done ? 0.4 : 1,
                    }}
                  />
                  <Text
                    style={{ fontSize: 13, color: accent, opacity: rem.done ? 0.4 : 1, fontFamily: fonts.sansSemi }}
                  >
                    {rem.trigger}
                  </Text>
                </View>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>

      <Pressable
        onPress={onOpenCapture}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: colors.surfaceHi,
          borderWidth: 1,
          borderColor: colors.hairline,
          borderRadius: 18,
          paddingVertical: 12,
          paddingLeft: 18,
          paddingRight: 12,
          marginTop: 12,
        }}
      >
        <Text style={{ flex: 1, color: colors.muted2, fontSize: 16 }}>Añadir aquí…</Text>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.green,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 24, color: colors.bg, lineHeight: 28, marginTop: -2 }}>+</Text>
        </View>
      </Pressable>
    </View>
  )
}
