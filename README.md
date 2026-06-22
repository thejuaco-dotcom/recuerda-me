# Cerca

> Recordatorios que llegan a ti, en vez de esperarte en una lista.

**Cerca** es una app de recordatorios con un alma calmada: te susurra, no te grita. Capturas en 2 segundos escribiendo en lenguaje natural y la app entiende el contexto, el lugar y el momento por ti — y, si algo importa de verdad, insiste hasta que lo confirmas.

App **nativa (iOS/Android)** hecha con **Expo / React Native + TypeScript**. Los recordatorios se guardan **en el dispositivo** y los avisos son **notificaciones reales del sistema**.

## Qué hace de verdad

- **Persistencia local** — tus recordatorios sobreviven a cerrar la app (AsyncStorage).
- **Captura en lenguaje natural** — escribe `comprar pan al volver a casa` y la app deduce contexto (Compras), ubicación (al llegar a casa) e insistencia. Eliges cuándo te avisa con un toque.
- **Notificaciones reales** — `expo-notifications` programa un aviso del sistema a la hora elegida. Marcar hecho lo cancela; posponer lo reprograma 10 min.
- **Aviso insistente** — los recordatorios importantes abren una pantalla de confirmación con anillo **mantén-para-confirmar**; al tocar la notificación se abre directamente.
- **Gestión** — marca hecho, reabre, o borra con pulsación larga, organizado por contexto.

## Pantallas

- **Inicio "Cerca de ti"** — mapa de burbujas con tus 5 contextos (la burbuja activa respira), banner _"Ahora cerca"_ y bandeja de avisos.
- **Contexto** — los recordatorios que viven en un lugar.
- **Captura** — lenguaje natural + selector de "¿cuándo te aviso?".
- **Aviso** — confirmación insistente a pantalla completa.

## Cómo probarla

Necesitas [Node.js](https://nodejs.org) 18+ y la app **Expo Go** en tu móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) · [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

```bash
npm install
npx expo start
```

Escanea el QR que aparece en la terminal con **Expo Go** (Android) o la **cámara** (iOS). La app se abre en tu teléfono. Acepta el permiso de notificaciones para que los avisos con hora funcionen de verdad.

> Las **notificaciones locales** funcionan en Expo Go. Para avisos por **ubicación real** (geofencing) y push remoto hace falta un _development build_ (`npx expo run:ios` / `run:android` o EAS), un paso natural más adelante.

### Pruébalo en 30 segundos

1. Toca la barra **"Anota algo en un susurro…"**.
2. Escribe `sacar la basura, importante` y elige **En 1 h** (o **Elegir…** para una hora exacta).
3. Guárdalo → aparece en **Casa** y verás **"1 aviso"** arriba; tócalo y **mantén pulsado** el círculo para confirmarlo.

## Estructura

```
App.tsx                  Carga de fuentes/datos, permisos y notificaciones, navegación
src/
  types.ts               Modelo (Reminder con dueAt + notifId)
  data.ts                Contextos y datos semilla
  parseDraft.ts          Lenguaje natural → contexto/lugar/cuándo/insiste
  storage.ts             Persistencia local (AsyncStorage)
  notifications.ts       Programar/cancelar notificaciones del sistema
  theme.ts               Paleta y tipografías
  icons.tsx              Iconos SVG
  components/
    BreathingHalo.tsx    Halo que respira tras la burbuja activa
    HoldRing.tsx         Anillo mantener-para-confirmar (SVG animado)
  screens/
    HomeScreen.tsx       Mapa de burbujas
    ContextScreen.tsx    Recordatorios de un contexto
    CaptureScreen.tsx    Captura + selector de hora
    NotifScreen.tsx      Aviso insistente
```

## Stack

- [Expo](https://expo.dev) SDK 56 · [React Native](https://reactnative.dev) · [TypeScript](https://www.typescriptlang.org/)
- `expo-notifications`, `@react-native-async-storage/async-storage`, `react-native-svg`, `expo-linear-gradient`, `expo-haptics`
- Tipografías [Newsreader](https://fonts.google.com/specimen/Newsreader) (los momentos) + [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) (la interfaz)
