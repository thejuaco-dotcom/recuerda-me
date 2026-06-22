# Cerca

> Recordatorios que llegan a ti, en vez de esperarte en una lista.

**Cerca** es una app de recordatorios con un alma calmada: te susurra, no te grita. Capturas en 2 segundos escribiendo en lenguaje natural y la app entiende el contexto, el lugar, el momento y la insistencia por ti.

Esta es la implementación en React + Vite + TypeScript del prototipo interactivo **"Cerca"** exportado desde Claude Design.

## Pantallas

- **Inicio — "Cerca de ti"** · Un campo de burbujas con tus 5 contextos (Casa, Trabajo, Compras, Personal, Ciudad). La burbuja activa respira. Arriba, un banner _"Ahora cerca"_ con lo siguiente y un aviso pendiente.
- **Contexto** · Los recordatorios que viven en un lugar. Toca uno para marcarlo hecho; el punto de color indica si depende de ubicación (verde), insiste (ámbar) o es libre (gris).
- **Captura** · Escribe una frase y _míralo entenderse solo_: la app extrae contexto, ubicación, cuándo e insistencia en vivo mientras escribes.
- **Aviso insistente** · Un overlay de pantalla bloqueada para lo que importa de verdad. _Mantén pulsado_ el anillo para confirmar — no se va hasta que lo cierres.

### Pruébalo

Escribe en la captura cosas como:

- `llamar al banco mañana`
- `comprar leche en el súper`
- `sacar la basura, importante`

…y abre el aviso (botón **"1 aviso"** arriba a la derecha) para confirmarlo manteniéndolo pulsado.

## Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) para el dev server y el build
- Tipografías: [Newsreader](https://fonts.google.com/specimen/Newsreader) (los momentos) · [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) (la interfaz)
- Sin dependencias de UI: el frame de iOS y todos los glifos están dibujados a mano para fidelidad pixel-perfect con el diseño.

## Estructura

```
src/
  App.tsx              Marco exterior (título, intro, pie)
  CercaApp.tsx         Estado y lógica de la app dentro del dispositivo
  parseDraft.ts        Lectura de lenguaje natural → contexto/lugar/cuándo/insiste
  data.ts              Contextos y recordatorios iniciales
  types.ts             Tipos del modelo
  components/
    IOSDevice.tsx      Frame de iOS (bisel, Dynamic Island, barra de estado)
    icons.tsx          Glifos CSS reutilizables (micrófono, pin…)
  screens/
    HomeScreen.tsx     Inicio "Cerca de ti"
    ContextScreen.tsx  Recordatorios de un contexto
    CaptureScreen.tsx  Captura en lenguaje natural
    NotifOverlay.tsx   Aviso insistente con mantener-para-confirmar
```

## Desarrollo

```bash
npm install
npm run dev      # arranca el dev server
npm run build    # type-check + build de producción a dist/
npm run preview  # sirve el build de producción
```
