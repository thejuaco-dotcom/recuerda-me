import { useEffect, useRef } from 'react'
import { Animated, Pressable, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { CheckIcon } from '../icons'
import { colors } from '../theme'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface Props {
  size?: number
  stroke?: number
  done: boolean
  onComplete: () => void
  /** Time in ms to hold before it confirms. */
  duration?: number
}

/** Hold-to-confirm ring: fills while pressed, fires onComplete when full. */
export function HoldRing({ size = 92, stroke = 7, done, onComplete, duration = 1000 }: Props) {
  const progress = useRef(new Animated.Value(0)).current
  const anim = useRef<Animated.CompositeAnimation | null>(null)

  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  useEffect(() => {
    if (done) progress.setValue(1)
  }, [done, progress])

  const start = () => {
    if (done) return
    anim.current?.stop()
    anim.current = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    })
    anim.current.start(({ finished }) => {
      if (finished) onComplete()
    })
  }

  const cancel = () => {
    if (done) return
    anim.current?.stop()
    Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver: false }).start()
  }

  const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [c, 0] })

  return (
    <Pressable onPressIn={start} onPressOut={cancel} hitSlop={8}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors.green}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dashoffset}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: stroke,
            left: stroke,
            right: stroke,
            bottom: stroke,
            borderRadius: size,
            backgroundColor: '#10151A',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {done ? (
            <CheckIcon size={28} color={colors.green} />
          ) : (
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.green }} />
          )}
        </View>
      </View>
    </Pressable>
  )
}
