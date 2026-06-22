import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'

interface Props {
  size: number
  color: string
  duration?: number
}

/** The slow expanding/fading halo behind the live "Casa" bubble. */
export function BreathingHalo({ size, color, duration = 4000 }: Props) {
  const t = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [t, duration])

  const scale = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.6, 1] })
  const opacity = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0, 0.5] })

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          alignSelf: 'center',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  )
}
