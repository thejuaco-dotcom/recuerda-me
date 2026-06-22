import type { CSSProperties } from 'react'
import type { ContextId } from '../types'
import { MicIcon } from '../components/icons'

interface BubbleVM {
  id: ContextId
  label: string
  count: number
  emphasis: boolean
  style: CSSProperties
  open: () => void
}

interface NextUpVM {
  has: boolean
  text: string
  trigger: string
  done: () => void
}

interface HomeScreenProps {
  hasNotifWaiting: boolean
  openNotif: () => void
  nextUp: NextUpVM
  contexts: BubbleVM[]
  totalCount: number
  openCapture: () => void
}

const glowStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 90,
  height: 90,
  borderRadius: '50%',
  background: 'rgba(167,216,182,0.16)',
  animation: 'breathe 4s ease-in-out infinite',
}

export function HomeScreen({
  hasNotifWaiting,
  openNotif,
  nextUp,
  contexts,
  totalCount,
  openCapture,
}: HomeScreenProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '70px 22px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#7E8A84',
            fontWeight: 700,
          }}
        >
          Cerca de ti
        </div>
        {hasNotifWaiting && (
          <div
            onClick={openNotif}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(167,216,182,0.12)',
              border: '1px solid rgba(167,216,182,0.25)',
              color: '#A7D8B6',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A7D8B6' }} />1 aviso
          </div>
        )}
      </div>

      {/* next-up banner */}
      {nextUp.has && (
        <div
          style={{
            marginTop: 16,
            position: 'relative',
            border: '1.5px solid rgba(167,216,182,0.4)',
            background: 'rgba(167,216,182,0.08)',
            borderRadius: 22,
            padding: '18px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#A7D8B6',
                fontWeight: 700,
              }}
            >
              Ahora cerca · {nextUp.trigger}
            </div>
            <div
              style={{
                fontFamily: "'Newsreader', serif",
                fontStyle: 'italic',
                fontSize: 25,
                lineHeight: 1.1,
                marginTop: 5,
                color: '#EAF6EE',
              }}
            >
              {nextUp.text}
            </div>
          </div>
          <div
            onClick={nextUp.done}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#A7D8B6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(167,216,182,0.3)',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 16,
                height: 9,
                borderLeft: '3px solid #11161A',
                borderBottom: '3px solid #11161A',
                transform: 'rotate(-45deg) translate(1px,-2px)',
              }}
            />
          </div>
        </div>
      )}

      {/* bubble field */}
      <div style={{ position: 'relative', flex: 1, marginTop: 18, minHeight: 380 }}>
        {contexts.map((ctx) => (
          <div key={ctx.id} onClick={ctx.open} style={ctx.style}>
            {ctx.emphasis && <span style={glowStyle} />}
            <div
              style={{
                fontFamily: "'Newsreader', serif",
                fontStyle: 'italic',
                fontSize: 28,
                lineHeight: 1,
                position: 'relative',
                color: '#EAECEA',
              }}
            >
              {ctx.count}
            </div>
            <div style={{ fontSize: 13, color: '#9AA39E', marginTop: 3, position: 'relative' }}>
              {ctx.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', fontSize: 13, color: '#6E7873', margin: '4px 0 14px' }}>
        {totalCount} recordatorios viven en 5 lugares
      </div>

      {/* capture bar */}
      <div
        onClick={openCapture}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          padding: '12px 12px 12px 18px',
          cursor: 'pointer',
        }}
      >
        <span style={{ flex: 1, color: '#7E8A84', fontSize: 16 }}>Anota algo en un susurro…</span>
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#A7D8B6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MicIcon />
        </span>
      </div>
    </div>
  )
}
