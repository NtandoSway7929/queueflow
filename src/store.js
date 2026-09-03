import { useEffect, useState } from 'react'
import {
  ACTIVE_STATUSES,
  BARBERS,
  PAID_METHODS,
  SA_NAMES,
  SERVICES,
  STORAGE_KEY,
  SYNC_EVENT,
  WAIT_MINUTES_PER_POSITION,
} from './constants'
import {
  applyCallTicket,
  applyCompleteTicket,
  applyMarkNoShow,
  applyStartService,
  callBlockedReason,
  canCall,
  canComplete,
  canStart,
  firstWaiting,
} from './queueRules'

export {
  firstWaiting,
  canCall,
  canStart,
  canComplete,
  callBlockedReason,
}

function minutesAgo(mins) {
  return Date.now() - mins * 60 * 1000
}

function ticket({
  id,
  barberId,
  number,
  customerName,
  service,
  price,
  paymentStatus,
  status,
  joinedAt,
  calledAt = null,
  startedAt = null,
  completedAt = null,
}) {
  return {
    id,
    barberId,
    number,
    customerName,
    service,
    price,
    paymentStatus,
    status,
    joinedAt,
    calledAt,
    startedAt,
    completedAt,
  }
}

function serviceByName(name) {
  return SERVICES.find((s) => s.name === name) || SERVICES[0]
}

export function createSeedState() {
  const haircut = serviceByName('Haircut')
  const combo = serviceByName('Haircut + Beard')
  const beard = serviceByName('Beard')
  const kids = serviceByName('Kids Haircut')

  return {
    barbers: BARBERS.map((b) => ({ ...b })),
    nextNumber: 27,
    demoCustomer: null,
    tickets: [
      ticket({
        id: 'seed-tshepo',
        barberId: 'thabo',
        number: 1,
        customerName: 'Tshepo',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(280),
        calledAt: minutesAgo(268),
        startedAt: minutesAgo(267),
        completedAt: minutesAgo(254),
      }),
      ticket({
        id: 'seed-dumisani',
        barberId: 'sizwe',
        number: 2,
        customerName: 'Dumisani',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(270),
        calledAt: minutesAgo(255),
        startedAt: minutesAgo(254),
        completedAt: minutesAgo(238),
      }),
      ticket({
        id: 'seed-refilwe',
        barberId: 'kabelo',
        number: 3,
        customerName: 'Refilwe',
        service: beard.name,
        price: beard.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(260),
        calledAt: minutesAgo(246),
        startedAt: minutesAgo(245),
        completedAt: minutesAgo(232),
      }),
      ticket({
        id: 'seed-jabulani',
        barberId: 'neo',
        number: 4,
        customerName: 'Jabulani',
        service: kids.name,
        price: kids.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(250),
        calledAt: minutesAgo(238),
        startedAt: minutesAgo(237),
        completedAt: minutesAgo(224),
      }),
      ticket({
        id: 'seed-ayanda',
        barberId: 'thabo',
        number: 5,
        customerName: 'Ayanda',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(240),
        calledAt: minutesAgo(226),
        startedAt: minutesAgo(225),
        completedAt: minutesAgo(210),
      }),
      ticket({
        id: 'seed-precious',
        barberId: 'neo',
        number: 6,
        customerName: 'Precious',
        service: beard.name,
        price: beard.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(210),
        calledAt: minutesAgo(198),
        startedAt: minutesAgo(197),
        completedAt: minutesAgo(185),
      }),
      ticket({
        id: 'seed-fatima',
        barberId: 'kabelo',
        number: 7,
        customerName: 'Fatima',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(200),
        calledAt: minutesAgo(172),
        startedAt: minutesAgo(171),
        completedAt: minutesAgo(152),
      }),
      ticket({
        id: 'seed-mandla',
        barberId: 'thabo',
        number: 8,
        customerName: 'Mandla',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(190),
        calledAt: minutesAgo(168),
        startedAt: minutesAgo(167),
        completedAt: minutesAgo(150),
      }),
      ticket({
        id: 'seed-bongani',
        barberId: 'sizwe',
        number: 9,
        customerName: 'Bongani',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(185),
        calledAt: minutesAgo(160),
        startedAt: minutesAgo(159),
        completedAt: minutesAgo(144),
      }),
      ticket({
        id: 'seed-zanele',
        barberId: 'thabo',
        number: 10,
        customerName: 'Zanele',
        service: kids.name,
        price: kids.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(155),
        calledAt: minutesAgo(138),
        startedAt: minutesAgo(137),
        completedAt: minutesAgo(122),
      }),
      ticket({
        id: 'seed-lindiwe',
        barberId: 'sizwe',
        number: 11,
        customerName: 'Lindiwe',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'eft',
        status: 'completed',
        joinedAt: minutesAgo(150),
        calledAt: minutesAgo(132),
        startedAt: minutesAgo(131),
        completedAt: minutesAgo(116),
      }),
      ticket({
        id: 'seed-sipho',
        barberId: 'thabo',
        number: 12,
        customerName: 'Sipho',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'card',
        status: 'serving',
        joinedAt: minutesAgo(70),
        calledAt: minutesAgo(18),
        startedAt: minutesAgo(16),
      }),
      ticket({
        id: 'seed-pieter',
        barberId: 'kabelo',
        number: 13,
        customerName: 'Pieter',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'cash',
        status: 'completed',
        joinedAt: minutesAgo(140),
        calledAt: minutesAgo(118),
        startedAt: minutesAgo(117),
        completedAt: minutesAgo(100),
      }),
      ticket({
        id: 'seed-andile',
        barberId: 'neo',
        number: 14,
        customerName: 'Andile',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'card',
        status: 'completed',
        joinedAt: minutesAgo(130),
        calledAt: minutesAgo(108),
        startedAt: minutesAgo(107),
        completedAt: minutesAgo(90),
      }),
      ticket({
        id: 'seed-thandi',
        barberId: 'sizwe',
        number: 15,
        customerName: 'Thandi',
        service: beard.name,
        price: beard.price,
        paymentStatus: 'cash',
        status: 'serving',
        joinedAt: minutesAgo(55),
        calledAt: minutesAgo(14),
        startedAt: minutesAgo(12),
      }),
      ticket({
        id: 'seed-naledi',
        barberId: 'kabelo',
        number: 16,
        customerName: 'Naledi',
        service: kids.name,
        price: kids.price,
        paymentStatus: 'eft',
        status: 'completed',
        joinedAt: minutesAgo(110),
        calledAt: minutesAgo(88),
        startedAt: minutesAgo(87),
        completedAt: minutesAgo(72),
      }),
      ticket({
        id: 'seed-sibusiso',
        barberId: 'neo',
        number: 17,
        customerName: 'Sibusiso',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'card',
        status: 'serving',
        joinedAt: minutesAgo(48),
        calledAt: minutesAgo(15),
        startedAt: minutesAgo(13),
      }),
      ticket({
        id: 'seed-amahle',
        barberId: 'thabo',
        number: 18,
        customerName: 'Amahle',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'pending',
        status: 'waiting',
        joinedAt: minutesAgo(28),
      }),
      ticket({
        id: 'seed-yusuf',
        barberId: 'kabelo',
        number: 19,
        customerName: 'Yusuf',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'pending',
        status: 'serving',
        joinedAt: minutesAgo(40),
        calledAt: minutesAgo(12),
        startedAt: minutesAgo(10),
      }),
      ticket({
        id: 'seed-kagiso',
        barberId: 'sizwe',
        number: 20,
        customerName: 'Kagiso',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'pending',
        status: 'waiting',
        joinedAt: minutesAgo(18),
      }),
      ticket({
        id: 'seed-lebo',
        barberId: 'thabo',
        number: 21,
        customerName: 'Lebo',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'eft',
        status: 'waiting',
        joinedAt: minutesAgo(11),
      }),
      ticket({
        id: 'seed-nomsa',
        barberId: 'sizwe',
        number: 22,
        customerName: 'Nomsa',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'cash',
        status: 'waiting',
        joinedAt: minutesAgo(7),
      }),
      ticket({
        id: 'seed-karabo',
        barberId: 'neo',
        number: 23,
        customerName: 'Karabo',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'pending',
        status: 'waiting',
        joinedAt: minutesAgo(5),
      }),
      ticket({
        id: 'seed-mpho',
        barberId: 'thabo',
        number: 24,
        customerName: 'Mpho',
        service: haircut.name,
        price: haircut.price,
        paymentStatus: 'pending',
        status: 'waiting',
        joinedAt: minutesAgo(4),
      }),
      ticket({
        id: 'seed-lesedi',
        barberId: 'kabelo',
        number: 25,
        customerName: 'Lesedi',
        service: combo.name,
        price: combo.price,
        paymentStatus: 'pending',
        status: 'waiting',
        joinedAt: minutesAgo(3),
      }),
      ticket({
        id: 'seed-khanyisile',
        barberId: 'neo',
        number: 26,
        customerName: 'Khanyisile',
        service: kids.name,
        price: kids.price,
        paymentStatus: 'cash',
        status: 'waiting',
        joinedAt: minutesAgo(2),
      }),
    ],
  }
}

function loadState() { if (typeof localStorage === "undefined") return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) { const seed = createSeedState(); localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return seed }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.tickets) || !Array.isArray(parsed.barbers)) {
      const seed = createSeedState(); localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return seed
    }
    return parsed
  } catch {
    const seed = createSeedState(); localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return seed
  }
}

let cached = loadState()

function persist(next) {
  cached = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }))
}

function update(recipe) {
  const next = recipe(cached)
  persist(next)
  return next
}

export function getState() {
  return cached
}

export function subscribe(listener) {
  const onCustom = (event) => listener(event.detail)
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      cached = JSON.parse(event.newValue)
      listener(cached)
    } catch {
      /* ignore malformed payloads */
    }
  }
  window.addEventListener(SYNC_EVENT, onCustom)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(SYNC_EVENT, onCustom)
    window.removeEventListener('storage', onStorage)
  }
}

export function useQueueStore() {
  const [state, setState] = useState(() => getState())
  useEffect(() => subscribe(setState), [])
  return state
}

export function isToday(ts) {
  if (!ts) return false
  const d = new Date(ts)
  const n = new Date()
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  )
}

export function waitingTickets(tickets, barberId) {
  return tickets
    .filter((t) => t.barberId === barberId && t.status === 'waiting')
    .sort((a, b) => a.number - b.number)
}

export function queueTickets(tickets, barberId) {
  return tickets
    .filter((t) => t.barberId === barberId && (t.status === 'waiting' || t.status === 'called'))
    .sort((a, b) => a.number - b.number)
}

export function servingTicket(tickets, barberId) {
  return tickets.find((t) => t.barberId === barberId && t.status === 'serving') || null
}

export function calledTicket(tickets, barberId) {
  return tickets.find((t) => t.barberId === barberId && t.status === 'called') || null
}

export function currentCustomer(tickets, barberId) {
  return servingTicket(tickets, barberId) || calledTicket(tickets, barberId)
}

export function isBusy(tickets, barberId) {
  const waiting = waitingTickets(tickets, barberId).length
  const called = calledTicket(tickets, barberId) ? 1 : 0
  const serving = Boolean(servingTicket(tickets, barberId))
  return serving || waiting + called >= 2
}

export function queuePosition(tickets, ticket) {
  if (!ticket || !ACTIVE_STATUSES.includes(ticket.status)) return null
  if (ticket.status === 'serving') return 0
  const line = queueTickets(tickets, ticket.barberId)
  const index = line.findIndex((t) => t.id === ticket.id)
  return index >= 0 ? index + 1 : null
}

export function averageServiceMinutes() {
  return WAIT_MINUTES_PER_POSITION // later: historical average
}

export function waitMinutesForPosition(position) {
  if (!position || position <= 0) return 0
  return position * averageServiceMinutes()
}

export function peopleAhead(tickets, barberId) {
  const waiting = waitingTickets(tickets, barberId).length
  const called = calledTicket(tickets, barberId) ? 1 : 0
  return waiting + called
}

export function waitIfJoining(tickets, barberId) {
  return waitMinutesForPosition(peopleAhead(tickets, barberId) + 1)
}

export function completedToday(tickets, barberId) {
  return tickets.filter(
    (t) =>
      t.status === 'completed' &&
      isToday(t.completedAt) &&
      (!barberId || t.barberId === barberId),
  )
}

export function countsTowardRevenue(ticket) {
  return ticket.status === 'completed' && PAID_METHODS.includes(ticket.paymentStatus)
}

export function revenueToday(tickets, barberId) {
  return tickets.reduce((sum, t) => {
    if (!countsTowardRevenue(t)) return sum
    if (!isToday(t.completedAt)) return sum
    if (barberId && t.barberId !== barberId) return sum
    return sum + (t.price || 0)
  }, 0)
}

export function customersToday(tickets, barberId) {
  return tickets.filter(
    (t) => isToday(t.joinedAt) && (!barberId || t.barberId === barberId),
  )
}

export function paymentCounts(tickets) {
  const today = tickets.filter((t) => isToday(t.joinedAt))
  const counts = { pending: 0, cash: 0, card: 0, eft: 0, paid: 0 }
  for (const t of today) {
    if (counts[t.paymentStatus] !== undefined) counts[t.paymentStatus] += 1
  }
  counts.paidTotal = today.filter((t) => PAID_METHODS.includes(t.paymentStatus)).length
  return counts
}

export function randomName(existing = []) {
  const used = new Set(existing)
  const pool = SA_NAMES.filter((n) => !used.has(n))
  const source = pool.length ? pool : SA_NAMES
  return source[Math.floor(Math.random() * source.length)]
}

export function findTicket(tickets, id) {
  return tickets.find((t) => t.id === id) || null
}

export function patchTicket(state, ticketId, patch) {
  return {
    ...state,
    tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, ...patch } : t)),
  }
}

export function joinQueue({ barberId, serviceId, customerName }) {
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]
  return update((state) => {
    const name =
      (customerName || '').trim() ||
      randomName(state.tickets.filter((t) => ACTIVE_STATUSES.includes(t.status)).map((t) => t.customerName))
    const newTicket = ticket({
      id: crypto.randomUUID(),
      barberId,
      number: state.nextNumber,
      customerName: name,
      service: service.name,
      price: service.price,
      paymentStatus: 'pending',
      status: 'waiting',
      joinedAt: Date.now(),
    })
    return {
      ...state,
      nextNumber: state.nextNumber + 1,
      tickets: [...state.tickets, newTicket],
      demoCustomer: { ticketId: newTicket.id },
    }
  })
}

export function addWalkIn({ barberId, customerName, serviceId, paymentStatus = 'cash' }) {
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]
  return update((state) => {
    const name = (customerName || '').trim() || randomName()
    const newTicket = ticket({
      id: crypto.randomUUID(),
      barberId,
      number: state.nextNumber,
      customerName: name,
      service: service.name,
      price: service.price,
      paymentStatus,
      status: 'waiting',
      joinedAt: Date.now(),
    })
    return {
      ...state,
      nextNumber: state.nextNumber + 1,
      tickets: [...state.tickets, newTicket],
    }
  })
}

export function leaveQueue(ticketId) {
  return update((state) => {
    const next = patchTicket(state, ticketId, { status: 'left', completedAt: Date.now() })
    const demoId = next.demoCustomer?.ticketId
    return {
      ...next,
      demoCustomer: demoId === ticketId ? null : next.demoCustomer,
    }
  })
}

export function dismissCustomerTicket() {
  return update((state) => ({ ...state, demoCustomer: null }))
}

export function payTicket(ticketId, method) {
  const paymentStatus = ['card', 'eft', 'cash', 'paid'].includes(method) ? method : 'paid'
  return update((state) => patchTicket(state, ticketId, { paymentStatus }))
}

export function callTicket(ticketId) {
  return update((state) => {
    const tickets = applyCallTicket(state.tickets, ticketId)
    if (tickets === state.tickets) return state
    return { ...state, tickets }
  })
}

export function startService(ticketId) {
  return update((state) => {
    const tickets = applyStartService(state.tickets, ticketId)
    if (tickets === state.tickets) return state
    return { ...state, tickets }
  })
}

export function completeTicket(ticketId) {
  return update((state) => {
    const tickets = applyCompleteTicket(state.tickets, ticketId)
    if (tickets === state.tickets) return state
    return { ...state, tickets }
  })
}

export function markNoShow(ticketId) {
  return update((state) => {
    const tickets = applyMarkNoShow(state.tickets, ticketId)
    if (tickets === state.tickets) return state
    return { ...state, tickets }
  })
}

export function resetDemo() {
  persist(createSeedState())
}

export function formatMoney(amount) {
  return `R${amount}`
}

export function formatQueueNumber(number) {
  return `#${number}`
}

export function minutesSince(ts, now = Date.now()) {
  if (!ts) return 0
  return Math.max(0, Math.floor((now - ts) / 60000))
}

export function formatWait(mins) {
  if (!mins || mins <= 0) return 'Now'
  if (mins < 60) return `~${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `~${h}h ${m}m` : `~${h}h`
}
