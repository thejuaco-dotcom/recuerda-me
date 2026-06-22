import { PinIcon, SmallMicIcon } from '../components/icons'

interface ParsedVM {
  show: boolean
  ctxLabel: string
  when: string
  loc: string
  hasLoc: boolean
  insist: boolean
}

interface CaptureScreenProps {
  draft: string
  setDraft: (value: string) => void
  parsed: ParsedVM
  canSave: boolean
  saveDraft: () => void
  goHome: () => void
}

const chipBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '9px 15px',
  fontSize: 14,
  fontWeight: 600,
} as const

export function CaptureScreen({ draft, setDraft, parsed, canSave, saveDraft, goHome }: CaptureScreenProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '70px 22px 40px' }}>
      <div onClick={goHome} style={{ fontSize: 15, color: '#7E8A84', cursor: 'pointer', alignSelf: 'flex-start' }}>
        Cancelar
      </div>
      <div
        style={{
          fontFamily: "'Newsreader', serif",
          fontStyle: 'italic',
          fontSize: 32,
          lineHeight: 1.1,
          marginTop: 18,
          color: '#EAECEA',
        }}
      >
        ¿Qué quieres
        <br />
        recordar?
      </div>

      <div style={{ marginTop: 26, borderBottom: '2px solid rgba(167,216,182,0.4)', paddingBottom: 12 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ej. comprar pan al volver a casa"
          autoFocus
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#EAECEA',
            fontSize: 21,
            lineHeight: 1.3,
          }}
        />
      </div>

      {parsed.show && (
        <div style={{ marginTop: 24, animation: 'risein .3s ease' }}>
          <div style={{ fontSize: 13, color: '#7E8A84', fontWeight: 600 }}>lo entendí así:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 12 }}>
            <span style={{ ...chipBase, background: 'rgba(167,216,182,0.12)', color: '#A7D8B6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#A7D8B6' }} />
              {parsed.ctxLabel}
            </span>
            {parsed.hasLoc && (
              <span style={{ ...chipBase, background: 'rgba(167,216,182,0.12)', color: '#A7D8B6' }}>
                <PinIcon />
                {parsed.loc}
              </span>
            )}
            <span style={{ ...chipBase, background: 'rgba(255,255,255,0.06)', color: '#C5CCD0' }}>{parsed.when}</span>
            {parsed.insist && (
              <span style={{ ...chipBase, background: 'rgba(224,176,120,0.14)', color: '#E0B078' }}>
                insiste hasta confirmar
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#5F6863', marginTop: 14 }}>
            aparecerá en <span style={{ color: '#A7D8B6' }}>{parsed.ctxLabel}</span> — toca un detalle para
            ajustarlo.
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: '#5F6863', display: 'flex', alignItems: 'center', gap: 9 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SmallMicIcon />
          </span>
          o mantén el micrófono para dictarlo
        </div>
        <div
          onClick={saveDraft}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 16,
            cursor: canSave ? 'pointer' : 'default',
            background: canSave ? '#A7D8B6' : 'rgba(255,255,255,0.06)',
            color: canSave ? '#11161A' : '#5F6863',
            transition: 'all .2s ease',
          }}
        >
          Guardar recordatorio
        </div>
      </div>
    </div>
  )
}
