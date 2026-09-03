/** Pure FIFO / chair-state guards. No React, no persistence. */

export function firstWaiting(tickets, barberId) {
  return (
    tickets
      .filter((t) => t.barberId === barberId && t.status === 'waiting')
      .sort((a, b) => a.number - b.number)[0] || null
  )
}

export function calledTicketFor(tickets, barberId) {
  return tickets.find((t) => t.barberId === barberId && t.status === 'called') || null
}

export function servingTicketFor(tickets, barberId) {
  return tickets.find((t) => t.barberId === barberId && t.status === 'serving') || null
}

export function canCall(tickets, ticket) {
  if (!ticket || ticket.status !== 'waiting') return false
  const first = firstWaiting(tickets, ticket.barberId)
  if (!first || first.id !== ticket.id) return false
  if (calledTicketFor(tickets, ticket.barberId)) return false
  return true
}

export function canStart(tickets, ticket) {
  if (!ticket || ticket.status !== 'called') return false
  if (servingTicketFor(tickets, ticket.barberId)) return false
  return true
}

export function canComplete(ticket) {
  return Boolean(ticket && ticket.status === 'serving')
}

export function canNoShow(ticket) {
  return Boolean(ticket && (ticket.status === 'waiting' || ticket.status === 'called'))
}

export function callBlockedReason(tickets, ticket) {
  if (!ticket || canCall(tickets, ticket)) return null
  const first = firstWaiting(tickets, ticket.barberId)
  if (ticket.status === 'waiting' && first && first.id !== ticket.id) {
    return 'Serve customers in queue order.'
  }
  if (calledTicketFor(tickets, ticket.barberId)) {
    return 'Finish the customer already called.'
  }
  return null
}

export function applyCallTicket(tickets, ticketId, now = Date.now()) {
  const target = tickets.find((t) => t.id === ticketId)
  if (!canCall(tickets, target)) return tickets
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, status: 'called', calledAt: now } : t,
  )
}

export function applyStartService(tickets, ticketId, now = Date.now()) {
  const target = tickets.find((t) => t.id === ticketId)
  if (!canStart(tickets, target)) return tickets
  return tickets.map((t) =>
    t.id === ticketId
      ? { ...t, status: 'serving', startedAt: now, calledAt: t.calledAt || now }
      : t,
  )
}

export function applyCompleteTicket(tickets, ticketId, now = Date.now()) {
  const target = tickets.find((t) => t.id === ticketId)
  if (!canComplete(target)) return tickets
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, status: 'completed', completedAt: now } : t,
  )
}

export function applyMarkNoShow(tickets, ticketId, now = Date.now()) {
  const target = tickets.find((t) => t.id === ticketId)
  if (!canNoShow(target)) return tickets
  return tickets.map((t) =>
    t.id === ticketId ? { ...t, status: 'noshow', completedAt: now } : t,
  )
}
