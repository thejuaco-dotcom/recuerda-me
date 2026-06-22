import type { ContextId, ContextMeta, RemindersByContext } from './types'

export const META: Record<ContextId, ContextMeta> = {
  casa: { label: 'Casa', top: 0, left: 4, size: 150, emphasis: true },
  trabajo: { label: 'Trabajo', top: 22, left: 226, size: 116 },
  compras: { label: 'Compras', top: 168, left: 8, size: 104 },
  personal: { label: 'Personal', top: 196, left: 262, size: 78 },
  ciudad: { label: 'Ciudad', top: 292, left: 150, size: 90 },
}

export const ORDER: ContextId[] = ['casa', 'trabajo', 'compras', 'personal', 'ciudad']

export const INITIAL_DATA: RemindersByContext = {
  casa: [
    { id: 'c1', text: 'Regar las plantas', trigger: 'al llegar a casa', loc: true, done: false },
    { id: 'c2', text: 'Sacar la basura', trigger: 'hoy 20:30 · insiste', insist: true, done: false },
    { id: 'c3', text: 'Llamar al portero', trigger: 'esta tarde', done: false },
  ],
  trabajo: [
    { id: 't1', text: 'Enviar el informe', trigger: 'al llegar a la oficina', loc: true, done: false },
    { id: 't2', text: 'Responder a Marta', trigger: 'antes de las 11', done: false },
  ],
  compras: [
    { id: 's1', text: 'Comprar pan', trigger: 'de camino a casa', loc: true, done: false },
    { id: 's2', text: 'Leche y huevos', trigger: 'en el súper', loc: true, done: false },
    { id: 's3', text: 'Pilas AA', trigger: 'cuando pases', done: false },
    { id: 's4', text: 'Regalo de Ana', trigger: 'esta semana', done: false },
    { id: 's5', text: 'Bombillas', trigger: 'en la ferretería', loc: true, done: false },
  ],
  personal: [
    { id: 'p1', text: 'Meditar 5 min', trigger: 'cada mañana · racha 8', done: false },
  ],
  ciudad: [
    { id: 'u1', text: 'Recoger receta', trigger: 'al pasar por la farmacia', loc: true, done: false },
  ],
}
