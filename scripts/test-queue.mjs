/**
 * FIFO queue-rule tests for QueueFlow.
 * Run from project root with vite-node: scripts/test-queue.mjs
 */

const memory = new Map()
globalThis.localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null
  },
  setItem(key, value) {
    memory.set(key, String(value))
  },
  removeItem(key) {
    memory.delete(key)
  },
  clear() {
    memory.clear()
  },
}

class FakeEvent {
  constructor(type, init = {}) {
    this.type = type
    Object.assign(this, init)
  }
}

class FakeCustomEvent extends FakeEvent {
  constructor(type, init = {}) {
    super(type, init)
    this.detail = init.detail
  }
}

globalThis.Event = FakeEvent
globalThis.CustomEvent = FakeCustomEvent

const listeners = new Map()
globalThis.window = {
  addEventListener(type, fn) {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type).add(fn)
  },
  removeEventListener(type, fn) {
    listeners.get(type)?.delete(fn)
  },
  dispatchEvent(event) {
    listeners.get(event.type)?.forEach((fn) => fn(event))
    return true
  },
}

if (!globalThis.crypto) globalThis.crypto = {}
if (typeof globalThis.crypto.randomUUID !== 'function') {
  let n = 0
  globalThis.crypto.randomUUID = () =>
    `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`
}

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    failed += 1
    console.error('FAIL:', msg)
  } else {
    console.log('ok:', msg)
  }
}

const {
  applyCallTicket,
  applyCompleteTicket,
  applyMarkNoShow,
  applyStartService,
  canCall,
  canComplete,
  canStart,
  callBlockedReason,
  firstWaiting,
} = await import('../src/queueRules.js')

function t(partial) {
  return {
    id: partial.id,
    barberId: partial.barberId || 'thabo',
    number: partial.number,
    status: partial.status,
    customerName: partial.customerName || partial.id,
    service: 'Haircut',
    price: 80,
    paymentStatus: 'pending',
    joinedAt: 1,
    calledAt: null,
    startedAt: null,
    completedAt: null,
    ...partial,
  }
}

{
  const tickets = [t({ id: '18', number: 18, status: 'waiting' }), t({ id: '21', number: 21, status: 'waiting' })]
  assert(firstWaiting(tickets, 'thabo')?.id === '18', 'first waiting is lowest number')
  assert(!canCall(tickets, tickets[1]), 'cannot call #21 while #18 waits')
  assert(callBlockedReason(tickets, tickets[1]) === 'Serve customers in queue order.', 'blocked reason is queue order')
  const next = applyCallTicket(tickets, '21')
  assert(next.find((x) => x.id === '21').status === 'waiting', 'later ticket stays waiting')
  assert(next.find((x) => x.id === '18').status === 'waiting', 'earlier ticket still waiting after skip attempt')
}

{
  let tickets = [t({ id: '18', number: 18, status: 'waiting' }), t({ id: '21', number: 21, status: 'waiting' })]
  tickets = applyCallTicket(tickets, '18')
  tickets = applyCallTicket(tickets, '21')
  const called = tickets.filter((x) => x.barberId === 'thabo' && x.status === 'called')
  assert(called.length === 1, 'only one called ticket per barber')
  assert(called[0].id === '18', 'the first waiting stays the called ticket')
}

{
  const tickets = [t({ id: '18', number: 18, status: 'called' }), t({ id: '21', number: 21, status: 'waiting' })]
  assert(!canCall(tickets, tickets[1]), 'cannot call while a called ticket exists')
  assert(
    callBlockedReason(tickets, tickets[1]) === 'Finish the customer already called.',
    'blocked reason mentions already called',
  )
  const next = applyCallTicket(tickets, '21')
  assert(next.find((x) => x.id === '18').status === 'called', 'already-called guest stays called')
  assert(next.find((x) => x.id === '21').status === 'waiting', 'later guest not promoted')
}

{
  const tickets = [t({ id: '12', number: 12, status: 'serving' }), t({ id: '18', number: 18, status: 'called' })]
  assert(!canStart(tickets, tickets[1]), 'cannot start while chair occupied')
  const next = applyStartService(tickets, '18')
  assert(next.find((x) => x.id === '12').status === 'serving', 'serving stays serving')
  assert(next.find((x) => x.id === '18').status === 'called', 'called stays called when chair full')
}

{
  const tickets = [t({ id: '18', number: 18, status: 'waiting' })]
  assert(!canStart(tickets, tickets[0]), 'waiting ticket is not startable')
  const next = applyStartService(tickets, '18')
  assert(next.find((x) => x.id === '18').status === 'waiting', 'waiting is not moved to serving')
}

{
  const tickets = [t({ id: '12', number: 12, status: 'serving' }), t({ id: '18', number: 18, status: 'waiting' })]
  assert(!canComplete(tickets[1]), 'cannot complete a waiting ticket')
  const skipped = applyCompleteTicket(tickets, '18')
  assert(skipped.find((x) => x.id === '18').status === 'waiting', 'complete on waiting is a no-op')
  const next = applyCompleteTicket(tickets, '12')
  assert(next.find((x) => x.id === '12').status === 'completed', 'serving ticket completes')
  assert(canCall(next, next.find((x) => x.id === '18')), 'next waiting is callable after complete')
}

{
  const tickets = [t({ id: '12', number: 12, status: 'serving' }), t({ id: '18', number: 18, status: 'waiting' })]
  assert(canCall(tickets, tickets[1]), 'can call next waiting while someone is in the chair')
}

{
  const tickets = [t({ id: '18', number: 18, status: 'called' }), t({ id: '21', number: 21, status: 'waiting' })]
  const next = applyMarkNoShow(tickets, '18')
  assert(next.find((x) => x.id === '18').status === 'noshow', 'called ticket becomes noshow')
  assert(canCall(next, next.find((x) => x.id === '21')), 'next waiting can be called after no-show')
  const serving = [t({ id: '12', number: 12, status: 'serving' })]
  const ignored = applyMarkNoShow(serving, '12')
  assert(ignored.find((x) => x.id === '12').status === 'serving', 'no-show on serving is a no-op')
}

{
  const store = await import('../src/store.js')
  const waiting = store.getState().tickets.find((x) => x.status === 'waiting')
  store.callTicket(waiting.id)
  const mutated = store.getState().tickets.some((x) => x.status === 'called')
  assert(mutated, 'store mutation applied before reset')
  store.resetDemo()
  const after = store.getState()
  const seed = store.createSeedState()
  assert(after.tickets.length === seed.tickets.length, 'reset restores seed ticket count')
  assert(after.nextNumber === seed.nextNumber, 'reset restores nextNumber')
  const statuses = after.tickets.map((x) => `${x.id}:${x.status}`).sort().join('|')
  const seedStatuses = seed.tickets.map((x) => `${x.id}:${x.status}`).sort().join('|')
  assert(statuses === seedStatuses, 'reset restores seed statuses')
}

if (failed) {
  console.error(`\n${failed} test(s) failed`)
  process.exit(1)
}
console.log('\nAll queue tests passed')
