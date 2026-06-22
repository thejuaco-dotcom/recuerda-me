/**
 * Small CSS-drawn glyphs reused across the Cerca screens, ported verbatim
 * from the prototype (it builds these from positioned spans rather than SVG).
 */

/** Microphone — the green capture button on home / context. */
export function MicIcon({ color = '#14191E' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', width: 14, height: 22, display: 'block' }}>
      <span
        style={{ position: 'absolute', top: 0, left: 3, width: 8, height: 13, borderRadius: 5, background: color }}
      />
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 1,
          width: 12,
          height: 9,
          border: `2px solid ${color}`,
          borderTop: 'none',
          borderRadius: '0 0 9px 9px',
        }}
      />
      <span style={{ position: 'absolute', bottom: 0, left: 6, width: 2, height: 4, background: color }} />
    </span>
  )
}

/** Smaller muted microphone used in the capture hint line. */
export function SmallMicIcon({ color = '#7E8A84' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', width: 9, height: 15, display: 'block' }}>
      <span
        style={{ position: 'absolute', top: 0, left: 2, width: 5, height: 9, borderRadius: 3, background: color }}
      />
      <span
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          width: 9,
          height: 6,
          border: `1.6px solid ${color}`,
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
        }}
      />
    </span>
  )
}

/** Map-pin dot used on location chips. */
export function PinIcon({ color = '#A7D8B6' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', width: 12, height: 12, display: 'inline-block' }}>
      <span style={{ position: 'absolute', inset: 0, border: `2px solid ${color}`, borderRadius: '50%' }} />
      <span
        style={{ position: 'absolute', top: 4, left: 4, width: 4, height: 4, borderRadius: '50%', background: color }}
      />
    </span>
  )
}
