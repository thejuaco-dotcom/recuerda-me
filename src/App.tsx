import { CercaApp } from './CercaApp'

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '48px 24px 64px',
        background: '#E7E5DF',
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#A8907E',
            fontWeight: 700,
          }}
        >
          Prototipo interactivo
        </div>
        <h1
          style={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 34,
            margin: '10px 0 8px',
            color: '#2B2722',
          }}
        >
          Cerca
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: '#6B6359', margin: 0 }}>
          Toca un lugar para ver lo que vive ahí · escribe en lenguaje natural y míralo entenderse solo · prueba el
          aviso que insiste.
        </p>
      </div>

      <CercaApp />

      <div
        style={{
          maxWidth: 420,
          textAlign: 'center',
          marginTop: 26,
          fontSize: 13,
          color: '#9A9388',
          lineHeight: 1.5,
        }}
      >
        Prueba a escribir <em>“llamar al banco mañana”</em>, <em>“comprar leche en el súper”</em> o{' '}
        <em>“sacar la basura, importante”</em> — y abre el aviso de arriba para confirmarlo manteniéndolo pulsado.
      </div>
    </div>
  )
}
