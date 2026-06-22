import type { ContextId, ContextMeta, Reminder } from './types'

export const META: Record<ContextId, ContextMeta> = {
  casa: { label: 'Casa', top: 0, left: 4, size: 150, emphasis: true },
  trabajo: { label: 'Trabajo', top: 22, left: 226, size: 116 },
  compras: { label: 'Compras', top: 168, left: 8, size: 104 },
  personal: { label: 'Personal', top: 196, left: 262, size: 78 },
  ciudad: { label: 'Ciudad', top: 292, left: 150, size: 90 },
}

export const ORDER: ContextId[] = ['casa', 'trabajo', 'compras', 'personal', 'ciudad']

/** Seed data, only used the very first time the app opens (before storage). */
export function seedReminders(): Reminder[] {
  const base = (
    partial: Omit<Reminder, 'createdAt' | 'dueAt' | 'notifId' | 'done'> & Partial<Reminder>,
  ): Reminder => ({
    done: false,
    createdAt: Date.now(),
    dueAt: null,
    notifId: null,
    ...partial,
  })

  return [
    base({ id: 'c1', contextId: 'casa', text: 'Regar las plantas', trigger: 'al llegar a casa', loc: true }),
    base({ id: 'c2', contextId: 'casa', text: 'Sacar la basura', trigger: 'hoy 20:30 · insiste', insist: true }),
    base({ id: 'c3', contextId: 'casa', text: 'Llamar al portero', trigger: 'esta tarde' }),
    base({ id: 't1', contextId: 'trabajo', text: 'Enviar el informe', trigger: 'al llegar a la oficina', loc: true }),
    base({ id: 't2', contextId: 'trabajo', text: 'Responder a Marta', trigger: 'antes de las 11' }),
    base({ id: 's1', contextId: 'compras', text: 'Comprar pan', trigger: 'de camino a casa', loc: true }),
    base({ id: 's2', contextId: 'compras', text: 'Leche y huevos', trigger: 'en el súper', loc: true }),
    base({ id: 's3', contextId: 'compras', text: 'Pilas AA', trigger: 'cuando pases' }),
    base({ id: 's4', contextId: 'compras', text: 'Regalo de Ana', trigger: 'esta semana' }),
    base({ id: 's5', contextId: 'compras', text: 'Bombillas', trigger: 'en la ferretería', loc: true }),
    base({ id: 'p1', contextId: 'personal', text: 'Meditar 5 min', trigger: 'cada mañana · racha 8' }),
    base({ id: 'u1', contextId: 'ciudad', text: 'Recoger receta', trigger: 'al pasar por la farmacia', loc: true }),
  ]
}
