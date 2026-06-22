import { useState } from 'react'
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { PinIcon } from '../icons'
import { parseDraft } from '../parseDraft'
import { colors, fonts } from '../theme'

type WhenChoice = 'none' | '1h' | 'tarde' | 'noche' | 'manana' | 'custom'

interface Props {
  topInset: number
  onCancel: () => void
  onSave: (text: string, dueAt: number | null) => void
}

function atToday(hour: number): number {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1)
  return d.getTime()
}

function computeDue(choice: WhenChoice, custom: Date | null): number | null {
  switch (choice) {
    case '1h':
      return Date.now() + 60 * 60 * 1000
    case 'tarde':
      return atToday(18)
    case 'noche':
      return atToday(21)
    case 'manana': {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      d.setHours(9, 0, 0, 0)
      return d.getTime()
    }
    case 'custom':
      return custom ? custom.getTime() : null
    default:
      return null
  }
}

function shortLabel(d: Date): string {
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${d.getDate()}/${d.getMonth() + 1} ${hh}:${mm}`
}

const chipText = { fontSize: 14, fontFamily: fonts.sansSemi } as const

export function CaptureScreen({ topInset, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState('')
  const [when, setWhen] = useState<WhenChoice>('none')
  const [custom, setCustom] = useState<Date | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const parsed = parseDraft(draft)
  const showParsed = draft.trim().length > 0
  const canSave = draft.trim().length > 1

  const whenChips: { key: WhenChoice; label: string }[] = [
    { key: 'none', label: 'Cuando sea' },
    { key: '1h', label: 'En 1 h' },
    { key: 'tarde', label: 'Esta tarde' },
    { key: 'noche', label: 'Esta noche' },
    { key: 'manana', label: 'Mañana 9:00' },
    { key: 'custom', label: custom ? shortLabel(custom) : 'Elegir…' },
  ]

  const pickCustom = () => {
    setShowPicker(true)
    setWhen('custom')
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: topInset + 16, paddingBottom: 40 }}>
      <Pressable onPress={onCancel}>
        <Text style={{ fontSize: 15, color: colors.muted2 }}>Cancelar</Text>
      </Pressable>

      <Text style={{ fontFamily: fonts.serifItalic, fontSize: 32, lineHeight: 36, color: colors.text, marginTop: 18 }}>
        ¿Qué quieres{'\n'}recordar?
      </Text>

      <View style={{ marginTop: 26, borderBottomWidth: 2, borderBottomColor: colors.greenBorder40, paddingBottom: 12 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="ej. comprar pan al volver a casa"
          placeholderTextColor={colors.muted2}
          autoFocus
          style={{ color: colors.text, fontSize: 21, padding: 0 }}
        />
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {showParsed && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 13, color: colors.muted2, fontFamily: fonts.sansSemi }}>lo entendí así:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 }}>
              <View style={[styleChip, { backgroundColor: colors.greenSoft12 }]}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
                <Text style={[chipText, { color: colors.green }]}>{parsed.ctxLabel}</Text>
              </View>
              {!!parsed.loc && (
                <View style={[styleChip, { backgroundColor: colors.greenSoft12 }]}>
                  <PinIcon size={13} color={colors.green} />
                  <Text style={[chipText, { color: colors.green }]}>{parsed.loc}</Text>
                </View>
              )}
              <View style={[styleChip, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                <Text style={[chipText, { color: colors.textDim }]}>{parsed.when}</Text>
              </View>
              {parsed.insist && (
                <View style={[styleChip, { backgroundColor: colors.amberSoft }]}>
                  <Text style={[chipText, { color: colors.amber }]}>insiste hasta confirmar</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 13, color: colors.faint, marginTop: 14 }}>
              aparecerá en <Text style={{ color: colors.green }}>{parsed.ctxLabel}</Text>.
            </Text>
          </View>
        )}

        {/* real alert time selector */}
        <View style={{ marginTop: 26 }}>
          <Text style={{ fontSize: 13, color: colors.muted2, fontFamily: fonts.sansSemi }}>¿cuándo te aviso?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 }}>
            {whenChips.map((chip) => {
              const active = when === chip.key
              return (
                <Pressable
                  key={chip.key}
                  onPress={() => (chip.key === 'custom' ? pickCustom() : setWhen(chip.key))}
                  style={[
                    styleChip,
                    {
                      backgroundColor: active ? colors.green : 'rgba(255,255,255,0.06)',
                      borderWidth: 1,
                      borderColor: active ? colors.green : colors.hairline,
                    },
                  ]}
                >
                  <Text style={[chipText, { color: active ? colors.greenInk : colors.textDim }]}>{chip.label}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            mode="datetime"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            value={custom ?? new Date(Date.now() + 60 * 60 * 1000)}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') setShowPicker(false)
              if (event.type === 'set' && date) {
                setCustom(date)
                setWhen('custom')
              }
            }}
            themeVariant="dark"
          />
        )}
      </ScrollView>

      <Pressable
        disabled={!canSave}
        onPress={() => onSave(draft.trim(), computeDue(when, custom))}
        style={{
          height: 54,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 14,
          backgroundColor: canSave ? colors.green : 'rgba(255,255,255,0.06)',
        }}
      >
        <Text style={{ fontFamily: fonts.sansSemi, fontSize: 16, color: canSave ? colors.greenInk : colors.faint }}>
          Guardar recordatorio
        </Text>
      </Pressable>
    </View>
  )
}

const styleChip = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  paddingVertical: 9,
  paddingHorizontal: 15,
} as const
