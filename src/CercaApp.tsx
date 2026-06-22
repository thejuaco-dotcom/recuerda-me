import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { IOSDevice } from './components/IOSDevice'
import { HomeScreen } from './screens/HomeScreen'
import { ContextScreen } from './screens/ContextScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { NotifOverlay } from './screens/NotifOverlay'
import { INITIAL_DATA, META, ORDER } from './data'
import { parseDraft } from './parseDraft'
import type { ContextId, ContextMeta, Reminder, RemindersByContext } from './types'

type Screen = 'home' | 'context' | 'capture'

/** Per-context bubble placement and skin on the home field. */
function bubbleStyle(meta: ContextMeta, emphasis?: boolean): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    top: meta.top,
    left: meta.left,
    width: meta.size,
    height: meta.size,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    overflow: 'hidden',
    transition: 'transform .2s ease',
  }
  if (emphasis) {
    return {
      ...base,
      border: '1.5px solid #A7D8B6',
      background: 'rgba(167,216,182,0.10)',
      boxShadow: '0 0 40px rgba(167,216,182,0.22)',
    }
  }
  return { ...base, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(255,255,255,0.04)' }
}

export function CercaApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeId, setActiveId] = useState<ContextId | null>(null)
  const [draft, setDraft] = useState('')
  const [data, setData] = useState<RemindersByContext>(INITIAL_DATA)

  const [showNotif, setShowNotif] = useState(false)
  const [notifProgress, setNotifProgress] = useState(0)
  const [notifDone, setNotifDone] = useState(false)

  const holdingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(
    () => () => {
      clearTimer()
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    },
    [],
  )

  const goHome = useCallback(() => setScreen('home'), [])
  const openCapture = useCallback(() => {
    setDraft('')
    setScreen('capture')
  }, [])

  const toggle = useCallback((ctxId: ContextId, remId: string) => {
    setData((d) => ({
      ...d,
      [ctxId]: d[ctxId].map((r) => (r.id === remId ? { ...r, done: !r.done } : r)),
    }))
  }, [])

  const saveDraft = useCallback(() => {
    const txt = draft.trim()
    if (txt.length < 2) return
    const p = parseDraft(txt)
    const rem: Reminder = {
      id: 'n' + Date.now(),
      text: txt,
      trigger: p.insist ? p.trigger + ' · insiste' : p.trigger,
      loc: !!p.loc,
      insist: p.insist,
      done: false,
    }
    setData((d) => ({ ...d, [p.ctx]: [rem, ...d[p.ctx]] }))
    setDraft('')
    setScreen('home')
  }, [draft])

  // ── Insistent notification ──────────────────────────────────────────────
  const basura = data.casa.find((r) => r.id === 'c2')
  const hasNotifWaiting = !!basura && !basura.done

  const openNotif = useCallback(() => {
    const waiting = data.casa.find((r) => r.id === 'c2' && !r.done)
    if (!waiting) return
    setNotifProgress(0)
    setNotifDone(false)
    setShowNotif(true)
  }, [data.casa])

  const dismissNotif = useCallback(() => {
    holdingRef.current = false
    clearTimer()
    setShowNotif(false)
    setNotifProgress(0)
  }, [])

  const completeNotif = useCallback(() => {
    setData((d) => ({
      ...d,
      casa: d.casa.map((r) => (r.id === 'c2' ? { ...r, done: true } : r)),
    }))
    setNotifDone(true)
    closeTimeoutRef.current = setTimeout(() => setShowNotif(false), 1000)
  }, [])

  const holdStart = useCallback(() => {
    if (notifDone) return
    holdingRef.current = true
    clearTimer()
    timerRef.current = setInterval(() => {
      if (!holdingRef.current) return
      setNotifProgress((prev) => {
        const next = Math.min(100, prev + 2.4)
        if (next >= 100) {
          holdingRef.current = false
          clearTimer()
          completeNotif()
        }
        return next
      })
    }, 24)
  }, [notifDone, completeNotif])

  const holdEnd = useCallback(() => {
    holdingRef.current = false
    clearTimer()
    setNotifProgress((prev) => (notifDone ? prev : 0))
  }, [notifDone])

  // ── Derived view model ──────────────────────────────────────────────────
  const contexts = ORDER.map((id) => {
    const meta = META[id]
    return {
      id,
      label: meta.label,
      count: data[id].filter((r) => !r.done).length,
      emphasis: !!meta.emphasis,
      style: bubbleStyle(meta, meta.emphasis),
      open: () => {
        setActiveId(id)
        setScreen('context')
      },
    }
  })

  const totalCount = ORDER.reduce((n, id) => n + data[id].filter((r) => !r.done).length, 0)

  const nu = data.casa.find((r) => !r.done)
  const nextUp = nu
    ? {
        has: true,
        text: nu.text,
        trigger: (nu.trigger || '').replace(' · insiste', ''),
        done: () => toggle('casa', nu.id),
      }
    : { has: false, text: '', trigger: '', done: () => {} }

  const aid: ContextId = activeId ?? 'casa'
  const active = {
    label: META[aid]?.label ?? '',
    reminders: (data[aid] ?? []).map((r) => ({
      ...r,
      accent: r.insist ? '#E0B078' : r.loc ? '#A7D8B6' : '#9AA39E',
      toggle: () => toggle(aid, r.id),
    })),
  }

  const p = parseDraft(draft)
  const parsed = {
    show: draft.trim().length > 0,
    ctxLabel: p.ctxLabel,
    when: p.when,
    loc: p.loc,
    hasLoc: !!p.loc,
    insist: p.insist,
  }
  const canSave = draft.trim().length > 1

  return (
    <IOSDevice dark>
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          background: '#14191E',
          fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
          color: '#EAECEA',
          overflow: 'hidden',
        }}
      >
        {screen === 'home' && (
          <HomeScreen
            hasNotifWaiting={hasNotifWaiting}
            openNotif={openNotif}
            nextUp={nextUp}
            contexts={contexts}
            totalCount={totalCount}
            openCapture={openCapture}
          />
        )}

        {screen === 'context' && (
          <ContextScreen active={active} goHome={goHome} openCapture={openCapture} />
        )}

        {screen === 'capture' && (
          <CaptureScreen
            draft={draft}
            setDraft={setDraft}
            parsed={parsed}
            canSave={canSave}
            saveDraft={saveDraft}
            goHome={goHome}
          />
        )}

        {showNotif && (
          <NotifOverlay
            progress={notifProgress}
            notifDone={notifDone}
            holdStart={holdStart}
            holdEnd={holdEnd}
            dismissNotif={dismissNotif}
          />
        )}
      </div>
    </IOSDevice>
  )
}
