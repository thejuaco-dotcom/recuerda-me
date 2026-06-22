# Cerca — Documento de handoff completo

> Pásale este archivo entero a un Claude (Claude Code) en local. Contiene **todo**
> lo necesario para crear la app desde cero, con versiones exactas, todo el código
> fuente y los errores ya resueltos. Construye exactamente lo que aquí se describe;
> no cambies versiones ni "modernices" dependencias.

---

## 0. Qué es

**Cerca** es una app **nativa Android/iOS** de recordatorios con alma calmada:
captura en lenguaje natural, contextos en burbujas, y avisos que insisten hasta
confirmarlos. Stack: **Expo SDK 55 + React Native 0.83.6 + TypeScript**.
Datos **locales** (AsyncStorage) y **notificaciones reales** (expo-notifications).

Funciona de verdad (no es maqueta): persiste recordatorios, los crea desde texto
en lenguaje natural con selector de hora, programa notificaciones del sistema,
marca hecho / pospone / borra, y abre la confirmación insistente al tocar el aviso.

### Pantallas
- **Inicio "Cerca de ti"**: mapa de burbujas con 5 contextos (la activa respira),
  banner "Ahora cerca" y bandeja de avisos.
- **Contexto**: recordatorios de un lugar; tocar = hecho, mantener pulsado = borrar.
- **Captura**: texto en lenguaje natural + chips "¿cuándo te aviso?" (1 h / tarde /
  noche / mañana / fecha-hora exacta).
- **Aviso**: pantalla completa con anillo "mantén para confirmar".

---

## 1. ⚠️ Claves que NO debes cambiar (errores ya resueltos)

1. **Expo SDK 55, no 56.** `create-expo-app@latest` instala SDK 56, que las apps
   Expo Go de las tiendas **todavía no soportan** ("requires a newer version of
   Expo Go"). Hay que **fijar SDK 55** y todas sus versiones compatibles (abajo).
2. **JDK 17 obligatorio** para `expo run:android`. Con JDK 21/24 el paso de C++
   (`expo-modules-core:configureCMakeDebug`) falla con
   *"A restricted method in java.lang.System has been called"*. Usa Temurin JDK 17
   y apunta `JAVA_HOME` a él. (Android Studio trae JBR 21 por defecto — no lo uses.)
3. **Fuentes** Newsreader (serif itálica, "los momentos") + Hanken Grotesk (UI),
   vía paquetes offline `@expo-google-fonts/*`, importadas por **subruta** (solo los
   pesos usados) para no empaquetar 30 ttf.
4. Tras cambiar versiones, **instala limpio**: borra `node_modules`,
   `package-lock.json` y la carpeta `android/` generada.

---

## 2. Crear el proyecto y fijar versiones

```bash
# 1) Andamiaje (se generará en SDK 56; lo bajaremos a 55 a mano)
npx create-expo-app@latest cerca --template blank-typescript
cd cerca

# 2) Reemplaza package.json por el de la sección 3 y luego:
rm -rf node_modules package-lock.json
npm install
```

Las versiones exactas (SDK 55) ya están en el `package.json` de la sección 3.
Vienen del mapa `node_modules/expo/bundledNativeModules.json` de `expo@55.0.26`
(React 19.2.0, RN 0.83.6, etc.). No las toques.

---

## 3. Archivos del proyecto

A continuación va el contenido **íntegro** de cada archivo. Crea la estructura:

```
cerca/
  index.ts
  App.tsx
  app.json
  tsconfig.json
  package.json
  assets/                # iconos por defecto del template de Expo (déjalos)
  src/
    types.ts
    data.ts
    parseDraft.ts
    theme.ts
    storage.ts
    notifications.ts
    icons.tsx
    components/
      BreathingHalo.tsx
      HoldRing.tsx
    screens/
      HomeScreen.tsx
      ContextScreen.tsx
      CaptureScreen.tsx
      NotifScreen.tsx
```

> Nota sobre `assets/`: usa los iconos que genera `create-expo-app` (icon.png,
> splash-icon.png, adaptive icons, favicon.png). El `app.json` los referencia.


### `package.json`

```json
{
  "name": "cerca",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "@expo-google-fonts/hanken-grotesk": "^0.4.3",
    "@expo-google-fonts/newsreader": "^0.4.1",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/datetimepicker": "8.6.0",
    "expo": "55.0.26",
    "expo-device": "~55.0.17",
    "expo-font": "~55.0.8",
    "expo-haptics": "~55.0.14",
    "expo-linear-gradient": "~55.0.14",
    "expo-notifications": "~55.0.23",
    "expo-status-bar": "~55.0.6",
    "expo-system-ui": "~55.0.18",
    "react": "19.2.0",
    "react-native": "0.83.6",
    "react-native-safe-area-context": "~5.6.2",
    "react-native-svg": "15.15.3"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~5.9.2"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "private": true
}
```

### `app.json`

```json
{
  "expo": {
    "name": "Cerca",
    "slug": "cerca",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "cerca",
    "userInterfaceStyle": "dark",
    "backgroundColor": "#14191E",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#14191E"
    },
    "ios": {
      "supportsTablet": true,
      "userInterfaceStyle": "dark"
    },
    "android": {
      "userInterfaceStyle": "dark",
      "adaptiveIcon": {
        "backgroundColor": "#14191E",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.thejuaco.cerca"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "color": "#A7D8B6"
        }
      ]
    ]
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### `index.ts`

```ts
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
```

### `src/types.ts`

```ts
export type ContextId = 'casa' | 'trabajo' | 'compras' | 'personal' | 'ciudad'

export interface ContextMeta {
  label: string
  /** Absolute placement of the bubble within the home field, in px. */
  top: number
  left: number
  /** Bubble diameter in px. */
  size: number
  /** The single highlighted "live" context (Casa) gets the green halo. */
  emphasis?: boolean
}

export interface Reminder {
  id: string
  contextId: ContextId
  text: string
  /** Human phrasing of when/where it fires, e.g. "al llegar a casa". */
  trigger: string
  /** Location-based trigger — paints the dot/label green. */
  loc?: boolean
  /** "Insistent" reminder — keeps nudging until confirmed. */
  insist?: boolean
  done: boolean
  createdAt: number
  /** Epoch ms when it should notify, or null for "cuando sea buen momento". */
  dueAt: number | null
  /** Identifier of the scheduled OS notification, so we can cancel it. */
  notifId: string | null
}

/** Result of reading a captured phrase in natural language. */
export interface ParsedDraft {
  ctx: ContextId
  ctxLabel: string
  when: string
  loc: string
  insist: boolean
  /** Location wins over time as the displayed trigger. */
  trigger: string
}
```

### `src/data.ts`

```ts
import type { ContextId, ContextMeta, Reminder } from './types'

export const META: Record<ContextId, ContextMeta> = {
  casa: { label: 'Casa', top: 0, left: 4, size: 150, emphasis: true },
  trabajo: { label: 'Trabajo', top: 22, left: 226, size: 116 },
  compras: { label: 'Compras', top: 168, left: 8, size: 104 },
  personal: { label: 'Personal', top: 196, left: 262, size: 78 },
  ciudad: { label: 'Ciudad', top: 292, left: 150, size: 90 },
}

export const ORDER: ContextId[] = ['casa', 'trabajo', 'compras', 'personal', 'ciudad']

/** Seed data, only used the very first time the app opens (before storage). */
export function seedReminders(): Reminder[] {
  const base = (
    partial: Omit<Reminder, 'createdAt' | 'dueAt' | 'notifId' | 'done'> & Partial<Reminder>,
  ): Reminder => ({
    done: false,
    createdAt: Date.now(),
    dueAt: null,
    notifId: null,
    ...partial,
  })

  return [
    base({ id: 'c1', contextId: 'casa', text: 'Regar las plantas', trigger: 'al llegar a casa', loc: true }),
    base({ id: 'c2', contextId: 'casa', text: 'Sacar la basura', trigger: 'hoy 20:30 · insiste', insist: true }),
    base({ id: 'c3', contextId: 'casa', text: 'Llamar al portero', trigger: 'esta tarde' }),
    base({ id: 't1', contextId: 'trabajo', text: 'Enviar el informe', trigger: 'al llegar a la oficina', loc: true }),
    base({ id: 't2', contextId: 'trabajo', text: 'Responder a Marta', trigger: 'antes de las 11' }),
    base({ id: 's1', contextId: 'compras', text: 'Comprar pan', trigger: 'de camino a casa', loc: true }),
    base({ id: 's2', contextId: 'compras', text: 'Leche y huevos', trigger: 'en el súper', loc: true }),
    base({ id: 's3', contextId: 'compras', text: 'Pilas AA', trigger: 'cuando pases' }),
    base({ id: 's4', contextId: 'compras', text: 'Regalo de Ana', trigger: 'esta semana' }),
    base({ id: 's5', contextId: 'compras', text: 'Bombillas', trigger: 'en la ferretería', loc: true }),
    base({ id: 'p1', contextId: 'personal', text: 'Meditar 5 min', trigger: 'cada mañana · racha 8' }),
    base({ id: 'u1', contextId: 'ciudad', text: 'Recoger receta', trigger: 'al pasar por la farmacia', loc: true }),
  ]
}
```

### `src/parseDraft.ts`

```ts
import { META } from './data'
import type { ContextId, ParsedDraft } from './types'

/**
 * Read a captured phrase in natural language and infer its context, timing,
 * location and whether it should insist. Ported verbatim from the Cerca
 * prototype so the "míralo entenderse solo" demo behaves identically.
 */
export function parseDraft(text: string): ParsedDraft {
  const t = (text || '').toLowerCase()

  let ctx: ContextId = 'personal'
  if (/(pan|leche|huevo|s[uú]per|mercado|comprar|compra|pilas|bombilla|regalo|ferreter)/.test(t)) ctx = 'compras'
  else if (/(trabajo|oficina|jefe|reuni[oó]n|informe|correo|marta|email|mail)/.test(t)) ctx = 'trabajo'
  else if (/(casa|plantas?|basura|regar|portero|lavar|cocina|hogar)/.test(t)) ctx = 'casa'
  else if (/(m[eé]dic|doctor|cita|banco|farmacia|receta|dentista|tr[aá]mite)/.test(t)) ctx = 'ciudad'

  let when = 'cuando sea buen momento'
  const time = t.match(/\b(\d{1,2})(?::(\d{2}))?\b/)
  if (/mañana/.test(t)) when = 'mañana'
  else if (/(esta noche|cenar|noche)/.test(t)) when = 'esta noche'
  else if (/tarde/.test(t)) when = 'esta tarde'
  else if (/hoy/.test(t)) when = 'hoy'
  else if (time) when = 'a las ' + time[1] + (time[2] ? ':' + time[2] : ':00')

  let loc = ''
  if (/(al llegar a casa|en casa|llegar a casa|al volver|camino a casa|de camino)/.test(t)) loc = 'al llegar a casa'
  else if (/(s[uú]per|mercado)/.test(t)) loc = 'en el súper'
  else if (/(oficina|al trabajo|llegar al trabajo)/.test(t)) loc = 'al llegar a la oficina'
  else if (/farmacia/.test(t)) loc = 'al pasar por la farmacia'
  else if (/ferreter/.test(t)) loc = 'en la ferretería'

  const insist = /(importante|no olvid|no se me olvid|s[ií] o s[ií]|urgente|imprescindible)/.test(t)

  return { ctx, ctxLabel: META[ctx].label, when, loc, insist, trigger: loc || when }
}
```

### `src/theme.ts`

```ts
// The calm dark palette of "Cerca". Greens are the live/location accent,
// amber means "insists", greys are the quiet background voices.
export const colors = {
  bg: '#14191E',
  bgDeep: '#0C1014',
  bgDeep2: '#161D24',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHi: 'rgba(255,255,255,0.05)',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineSoft: 'rgba(255,255,255,0.07)',

  green: '#A7D8B6',
  greenInk: '#11161A',
  greenTextHi: '#EAF6EE',
  greenSoft12: 'rgba(167,216,182,0.12)',
  greenSoft10: 'rgba(167,216,182,0.10)',
  greenSoft08: 'rgba(167,216,182,0.08)',
  greenBorder40: 'rgba(167,216,182,0.4)',
  greenBorder25: 'rgba(167,216,182,0.25)',

  amber: '#E0B078',
  amberSoft: 'rgba(224,176,120,0.14)',

  text: '#EAECEA',
  textDim: '#C5CCD0',
  muted: '#9AA39E',
  muted2: '#7E8A84',
  muted3: '#6E7873',
  faint: '#5F6863',
}

// Newsreader italic carries "the moments"; Hanken Grotesk is the interface.
export const fonts = {
  serifItalic: 'Newsreader_400Regular_Italic',
  serifItalicMed: 'Newsreader_500Medium_Italic',
  sans: 'HankenGrotesk_400Regular',
  sansMed: 'HankenGrotesk_500Medium',
  sansSemi: 'HankenGrotesk_600SemiBold',
  sansBold: 'HankenGrotesk_700Bold',
}
```

### `src/storage.ts`

```ts
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
```

### `src/notifications.ts`

```ts
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
```

### `src/icons.tsx`

```tsx
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
```

### `src/components/BreathingHalo.tsx`

```tsx
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
```

### `src/components/HoldRing.tsx`

```tsx
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
```

### `App.tsx`

```tsx
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
```

### `src/screens/HomeScreen.tsx`

```tsx
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
```

### `src/screens/ContextScreen.tsx`

```tsx
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
```

### `src/screens/CaptureScreen.tsx`

```tsx
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
```

### `src/screens/NotifScreen.tsx`

```tsx
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
```

---

## 4. Probar rápido (Expo Go — recomendado para iterar)

Requiere la app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS](https://apps.apple.com/app/expo-go/id982107779)) y el móvil en la **misma WiFi** que el PC.

```bash
npx expo start
```

Escanea el QR (Android: Expo Go → Scan; iOS: app Cámara). Acepta el permiso de
notificaciones. Como el proyecto está en SDK 55, Expo Go lo abrirá sin el error de
incompatibilidad.

> Si la red da problemas: `npx expo start --tunnel`.

---

## 5. Instalar como app nativa en un dispositivo conectado (USB)

Esto compila un APK y lo instala directo en el teléfono (sin Expo Go).

### Requisitos en el PC
- **Android Studio** + SDK (Platform, Platform-Tools, Build-Tools).
- **JDK 17** (Temurin) y `JAVA_HOME` apuntando a él. **No uses JDK 21/24.**
- `ANDROID_HOME` apuntando al SDK; `platform-tools` en el PATH (para `adb`).

### Preparar el móvil
1. Ajustes → Acerca del teléfono → pulsa "Número de compilación" 7 veces.
2. Opciones de desarrollador → activa **Depuración por USB**.
3. Conecta por USB y pulsa **Permitir** en el aviso del móvil.
4. Verifica: `adb devices` (debe salir como `device`, no `unauthorized`).

### Comprobar Java (causa nº1 de fallos)
```bash
java -version    # DEBE decir 17
```
En PowerShell, para la sesión actual:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### Compilar e instalar
```bash
npx expo run:android
```
La primera vez tarda 5–15 min (descarga Gradle/NDK). Al acabar, Cerca queda
instalada y se abre sola.

---

## 6. Alternativa fiable: build en la nube (EAS) → APK instalable

Si el build local de C++ en Windows da guerra, deja que Expo lo compile en la nube:

```bash
npm install -g eas-cli
eas login                         # cuenta gratuita de Expo
eas build -p android --profile preview
```

Crea `eas.json` con un perfil que produzca **APK** (no AAB) para instalar a mano:

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {}
  }
}
```

Al terminar, EAS da un enlace/QR; ábrelo en el móvil e instala el APK.

---

## 7. Errores frecuentes y solución

| Síntoma | Causa / solución |
|---|---|
| `Project is incompatible with this version of Expo Go` | Estás en SDK 56. Fija SDK 55 (sección 2/3) y reinstala limpio. |
| `expo-modules-core:configureCMakeDebug ... FAILED` + `A restricted method in java.lang.System` | JDK demasiado nuevo. Usa **JDK 17** y reapunta `JAVA_HOME`. |
| `git pull` aborta por `package-lock.json` | Archivo generado; `git checkout -- package-lock.json` o `git reset --hard`. |
| `rm -rf` falla en PowerShell | Usa `Remove-Item -Recurse -Force node_modules, package-lock.json, android`. |
| `adb: command not found` | Falta `platform-tools` en el PATH. |
| `SDK location not found` | Define `ANDROID_HOME` o crea `android/local.properties` con `sdk.dir=...`. |
| El móvil no conecta por WiFi (Expo Go) | `npx expo start --tunnel`. |

---

## 8. Cómo verificar sin dispositivo

```bash
npx tsc --noEmit          # tipos
npx expo export --platform android --output-dir /tmp/exp   # empaqueta con Metro
```
Ambos deben terminar sin errores.

---

## 9. Notas de alcance (futuro)

- La **ubicación** ("al llegar a casa") hoy es una **etiqueta**; el geofencing real
  (avisos por llegar a un sitio) necesita `expo-location` + `expo-task-manager` y un
  **development build** (no funciona en Expo Go).
- Las notificaciones **locales por hora** sí funcionan en Expo Go y en build nativo.
- La insistencia programa el aviso a su hora; un re-aviso periódico tras vencer
  requeriría lógica en segundo plano (siguiente iteración).

