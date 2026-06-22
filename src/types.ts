export type ContextId = 'casa' | 'trabajo' | 'compras' | 'personal' | 'ciudad'

export interface ContextMeta {
  label: string
  /** Absolute placement of the bubble within the 380px-tall field, in px. */
  top: number
  left: number
  /** Bubble diameter in px. */
  size: number
  /** The single highlighted "live" context (Casa) gets the green halo. */
  emphasis?: boolean
}

export interface Reminder {
  id: string
  text: string
  /** Human phrasing of when/where it fires, e.g. "al llegar a casa". */
  trigger: string
  /** Location-based trigger — paints the dot/label green. */
  loc?: boolean
  /** "Insistent" reminder — paints amber and keeps coming back. */
  insist?: boolean
  done: boolean
}

export type RemindersByContext = Record<ContextId, Reminder[]>

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
