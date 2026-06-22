import type { Reminder } from '../types'

interface ReminderVM extends Reminder {
  accent: string
  toggle: () => void
}

interface ContextScreenProps {
  active: { label: string; reminders: ReminderVM[] }
  goHome: () => void
  openCapture: () => void
}

export function ContextScreen({ active, goHome, openCapture }: ContextScreenProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '70px 22px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          onClick={goHome}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 11,
              height: 11,
              borderLeft: '2.5px solid #C5CCD0',
              borderBottom: '2.5px solid #C5CCD0',
              transform: 'rotate(45deg)',
              marginLeft: 3,
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#7E8A84',
              fontWeight: 700,
            }}
          >
            Contexto
          </div>
          <div
            style={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              fontSize: 30,
              lineHeight: 1,
              color: '#EAECEA',
            }}
          >
            {active.label}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          marginTop: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'auto',
        }}
      >
        {active.reminders.map((rem) => (
          <div
            key={rem.id}
            onClick={rem.toggle}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '15px 16px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 1,
                color: '#11161A',
                border: rem.done ? '1.5px solid #A7D8B6' : '1.5px solid rgba(255,255,255,0.25)',
                background: rem.done ? '#A7D8B6' : 'transparent',
              }}
            >
              {rem.done ? '✓' : ''}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.25,
                  color: rem.done ? '#5F6863' : '#EAECEA',
                  textDecoration: rem.done ? 'line-through' : 'none',
                }}
              >
                {rem.text}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: rem.accent,
                    opacity: rem.done ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: rem.accent,
                    opacity: rem.done ? 0.4 : 1,
                    fontWeight: 600,
                  }}
                >
                  {rem.trigger}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
          marginTop: 12,
        }}
      >
        <span style={{ flex: 1, color: '#7E8A84', fontSize: 16 }}>Añadir aquí…</span>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#A7D8B6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22,
            color: '#14191E',
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </div>
    </div>
  )
}
