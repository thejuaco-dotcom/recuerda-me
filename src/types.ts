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
