import { Pressable, Text, useWindowDimensions, View } from 'react-native'
import { BreathingHalo } from '../components/BreathingHalo'
import { MicIcon } from '../icons'
import { META, ORDER } from '../data'
import { colors, fonts } from '../theme'
import type { ContextId } from '../types'

const FIELD_W = 346
const FIELD_H = 384

export interface NextUp {
  text: string
  trigger: string
  onDone: () => void
}

interface Props {
  topInset: number
  alertsCount: number
  onOpenAlerts: () => void
  nextUp: NextUp | null
  counts: Record<ContextId, number>
  totalCount: number
  onOpenContext: (id: ContextId) => void
  onOpenCapture: () => void
}

export function HomeScreen({
  topInset,
  alertsCount,
  onOpenAlerts,
  nextUp,
  counts,
  totalCount,
  onOpenContext,
  onOpenCapture,
}: Props) {
  const { width } = useWindowDimensions()
  const avail = width - 44
  const scale = Math.min(1, avail / FIELD_W)

  return (
    <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: topInset + 16, paddingBottom: 44 }}>
      {/* header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, letterSpacing: 2, color: colors.muted2, fontFamily: fonts.sansBold }}>
          CERCA DE TI
        </Text>
        {alertsCount > 0 && (
          <Pressable
            onPress={onOpenAlerts}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              backgroundColor: colors.greenSoft12,
              borderWidth: 1,
              borderColor: colors.greenBorder25,
              borderRadius: 999,
              paddingVertical: 6,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }} />
            <Text style={{ color: colors.green, fontSize: 12, fontFamily: fonts.sansSemi }}>
              {alertsCount} aviso{alertsCount > 1 ? 's' : ''}
            </Text>
          </Pressable>
        )}
      </View>

      {/* next-up banner */}
      {nextUp && (
        <View
          style={{
            marginTop: 16,
            borderWidth: 1.5,
            borderColor: colors.greenBorder40,
            backgroundColor: colors.greenSoft08,
            borderRadius: 22,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, letterSpacing: 1, color: colors.green, fontFamily: fonts.sansBold }}>
              AHORA CERCA · {nextUp.trigger.toUpperCase()}
            </Text>
            <Text style={{ fontFamily: fonts.serifItalic, fontSize: 25, color: colors.greenTextHi, marginTop: 5 }}>
              {nextUp.text}
            </Text>
          </View>
          <Pressable
            onPress={nextUp.onDone}
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 16,
                height: 9,
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderColor: colors.greenInk,
                transform: [{ rotate: '-45deg' }, { translateY: -1 }],
              }}
            />
          </Pressable>
        </View>
      )}

      {/* bubble field */}
      <View style={{ flex: 1, marginTop: 18, justifyContent: 'center' }}>
        <View style={{ height: FIELD_H * scale, width: '100%' }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: FIELD_W,
              height: FIELD_H,
              transform: [{ scale }],
              transformOrigin: 'top left',
            }}
          >
            {ORDER.map((id) => {
              const meta = META[id]
              const emphasis = !!meta.emphasis
              return (
                <Pressable
                  key={id}
                  onPress={() => onOpenContext(id)}
                  style={{
                    position: 'absolute',
                    top: meta.top,
                    left: meta.left,
                    width: meta.size,
                    height: meta.size,
                    borderRadius: meta.size / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderWidth: emphasis ? 1.5 : 1,
                    borderColor: emphasis ? colors.green : 'rgba(255,255,255,0.11)',
                    backgroundColor: emphasis ? colors.greenSoft10 : colors.surface,
                  }}
                >
                  {emphasis && <BreathingHalo size={90} color="rgba(167,216,182,0.16)" />}
                  <Text style={{ fontFamily: fonts.serifItalic, fontSize: 28, color: colors.text }}>
                    {counts[id]}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.muted, marginTop: 3 }}>{meta.label}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      </View>

      <Text style={{ textAlign: 'center', fontSize: 13, color: colors.muted3, marginVertical: 10 }}>
        {totalCount} recordatorios viven en 5 lugares
      </Text>

      {/* capture bar */}
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
        }}
      >
        <Text style={{ flex: 1, color: colors.muted2, fontSize: 16 }}>Anota algo en un susurro…</Text>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.green,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MicIcon size={22} color={colors.bg} />
        </View>
      </Pressable>
    </View>
  )
}
