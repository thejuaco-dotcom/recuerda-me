import Svg, { Circle, Line, Path, Rect } from 'react-native-svg'

export function MicIcon({ size = 22, color = '#11161A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={9} y={3} width={6} height={11} rx={3} fill={color} />
      <Path d="M6 11.5a6 6 0 0 0 12 0" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Line x1={12} y1={17.5} x2={12} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={9} y1={21} x2={15} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

export function PinIcon({ size = 13, color = '#A7D8B6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Circle cx={6} cy={6} r={5} stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={6} cy={6} r={2} fill={color} />
    </Svg>
  )
}

export function CheckIcon({ size = 16, color = '#11161A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 6.5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function ChevronLeft({ size = 14, color = '#C5CCD0' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 4l-8 8 8 8" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
