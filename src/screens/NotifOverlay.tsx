interface NotifOverlayProps {
  progress: number
  notifDone: boolean
  holdStart: () => void
  holdEnd: () => void
  dismissNotif: () => void
}

const NOTIF_TEXT = 'Sacar la basura'

export function NotifOverlay({ progress, notifDone, holdStart, holdEnd, dismissNotif }: NotifOverlayProps) {
  const sub = notifDone
    ? '¡hecho! gracias por cerrarlo.'
    : 'te lo recordé 2 veces hoy · no se irá del todo hasta que confirmes.'
  const cta = notifDone ? '¡hecho!' : 'mantén para confirmar'

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: 'linear-gradient(180deg,#0C1014 0%,#161D24 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '84px 22px 46px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: '#8A938F' }}>martes 22 de junio</div>
        <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: -2, lineHeight: 1, marginTop: 6 }}>20:30</div>
      </div>

      <div
        style={{
          marginTop: 'auto',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 26,
          padding: '22px 20px',
          animation: 'risein .4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: '#A7D8B6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14191E' }} />
          </span>
          <span style={{ fontSize: 13, color: '#9AA39E', fontWeight: 600, flex: 1 }}>CERCA · RECORDATORIO</span>
          <span style={{ fontSize: 13, color: '#7E8A84' }}>ahora</span>
        </div>
        <div
          style={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontSize: 13,
            color: '#A7D8B6',
            marginTop: 16,
          }}
        >
          sigo aquí, sin prisa
        </div>
        <div style={{ fontSize: 23, fontWeight: 600, marginTop: 4 }}>{NOTIF_TEXT}</div>
        <div style={{ fontSize: 14, color: '#8A938F', marginTop: 8, lineHeight: 1.4 }}>{sub}</div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 22 }}>
          <div
            onPointerDown={holdStart}
            onPointerUp={holdEnd}
            onPointerLeave={holdEnd}
            style={{ position: 'relative', width: 92, height: 92, cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `conic-gradient(#A7D8B6 ${progress * 3.6}deg, rgba(255,255,255,0.10) 0deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 7,
                borderRadius: '50%',
                background: '#10151A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {notifDone ? (
                <span
                  style={{
                    display: 'block',
                    width: 22,
                    height: 12,
                    borderLeft: '3px solid #A7D8B6',
                    borderBottom: '3px solid #A7D8B6',
                    transform: 'rotate(-45deg) translate(1px,-3px)',
                  }}
                />
              ) : (
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#A7D8B6' }} />
              )}
            </div>
          </div>
          <div style={{ fontSize: 15, color: '#A7D8B6', fontWeight: 600 }}>{cta}</div>
        </div>
        <div
          onClick={dismissNotif}
          style={{ textAlign: 'center', fontSize: 15, color: '#8A938F', marginTop: 18, cursor: 'pointer' }}
        >
          recuérdamelo en 10 min
        </div>
      </div>
    </div>
  )
}
