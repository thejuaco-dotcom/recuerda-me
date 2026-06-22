import { META } from './data'
import type { ContextId, ParsedDraft } from './types'

/**
 * Read a captured phrase in natural language and infer its context, timing,
 * location and whether it should insist. Ported verbatim from the Cerca
 * prototype so the "míralo entenderse solo" demo behaves identically.
 */
export function parseDraft(text: string): ParsedDraft {
  const t = (text || '').toLowerCase()

  let ctx: ContextId = 'personal'
  if (/(pan|leche|huevo|s[uú]per|mercado|comprar|compra|pilas|bombilla|regalo|ferreter)/.test(t)) ctx = 'compras'
  else if (/(trabajo|oficina|jefe|reuni[oó]n|informe|correo|marta|email|mail)/.test(t)) ctx = 'trabajo'
  else if (/(casa|plantas?|basura|regar|portero|lavar|cocina|hogar)/.test(t)) ctx = 'casa'
  else if (/(m[eé]dic|doctor|cita|banco|farmacia|receta|dentista|tr[aá]mite)/.test(t)) ctx = 'ciudad'

  let when = 'cuando sea buen momento'
  const time = t.match(/\b(\d{1,2})(?::(\d{2}))?\b/)
  if (/mañana/.test(t)) when = 'mañana'
  else if (/(esta noche|cenar|noche)/.test(t)) when = 'esta noche'
  else if (/tarde/.test(t)) when = 'esta tarde'
  else if (/hoy/.test(t)) when = 'hoy'
  else if (time) when = 'a las ' + time[1] + (time[2] ? ':' + time[2] : ':00')

  let loc = ''
  if (/(al llegar a casa|en casa|llegar a casa|al volver|camino a casa|de camino)/.test(t)) loc = 'al llegar a casa'
  else if (/(s[uú]per|mercado)/.test(t)) loc = 'en el súper'
  else if (/(oficina|al trabajo|llegar al trabajo)/.test(t)) loc = 'al llegar a la oficina'
  else if (/farmacia/.test(t)) loc = 'al pasar por la farmacia'
  else if (/ferreter/.test(t)) loc = 'en la ferretería'

  const insist = /(importante|no olvid|no se me olvid|s[ií] o s[ií]|urgente|imprescindible)/.test(t)

  return { ctx, ctxLabel: META[ctx].label, when, loc, insist, trigger: loc || when }
}
