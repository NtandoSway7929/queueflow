import { useEffect, useState } from 'react'
import {
  BARBERS,
  SERVICES,
  SHOP_NAME,
  UI_BARBER_PAGE_KEY,
} from '../constants'
import {
  addWalkIn,
  callBlockedReason,
  callTicket,
  canCall,
  canStart,
  completeTicket,
  currentCustomer,
  firstWaiting,
  formatMoney,
  formatQueueNumber,
  minutesSince,
  queueTickets,
  revenueToday,
  startService,
  markNoShow,
  waitingTickets,
  completedToday,
} from '../store'
import { DangerButton, PaymentBadge, PrimaryButton, SecondaryButton, StatusBadge } from './ui'

function readPage() {
  const saved = sessionStorage.getItem(UI_BARBER_PAGE_KEY)
  if (saved === 'queue' || saved === 'current' || saved === 'history') return saved
  return 'current'
}

function AddCustomer({ barberId, onClose }) {
  const [name, setName] = useState('')
  const [serviceId, setServiceId] = useState('haircut')
  const [cash, setCash] = useState(true)

  function submit() {
    addWalkIn({
      barberId,
      customerName: name,
      serviceId,
      paymentStatus: cash ? 'cash' : 'pending',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/90 sm:items-end">
      <div className="w-full border-t border-rule bg-canvas px-5 pb-8 pt-6 sm:px-8">
        <p className="eyebrow">Walk-in</p>
        <h2 className="font-display mt-2 text-2xl font-semibold">Add customer</h2>
        <p className="mt-1 text-sm text-soft">They get the next number for this chair.</p>
        <label className="mt-8 block text-sm font-medium text-off">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 min-h-11 w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-base text-off outline-none focus:border-soft"
            placeholder="e.g. Dumisani"
          />
        </label>
        <label className="mt-6 block text-sm font-medium text-off">
          Service
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-2 min-h-11 w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-base text-off"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {formatMoney(s.price)}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-6 flex min-h-11 items-center gap-2 text-sm text-off">
          <input type="checkbox" checked={cash} onChange={(e) => setCash(e.target.checked)} />
          Paying cash at the shop
        </label>
        <div className="mt-6 flex items-center justify-between gap-6 border-t border-rule pt-5">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submit} disabled={!name.trim()}>
            Add to queue
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { id: 'queue', label: 'Queue' },
  { id: 'current', label: 'Current client' },
  { id: 'history', label: 'History' },
]

export default function BarberView({ state, barberId }) {
  const [page, setPage] = useState(readPage)
  const [adding, setAdding] = useState(false)
  const barber = BARBERS.find((b) => b.id === barberId) || BARBERS[0]
  const tickets = state.tickets
  const waiting = waitingTickets(tickets, barber.id)
  const current = currentCustomer(tickets, barber.id)
  const queue = queueTickets(tickets, barber.id)
  const done = completedToday(tickets, barber.id)
  const revenue = revenueToday(tickets, barber.id)
  const next = firstWaiting(tickets, barber.id)

  useEffect(() => {
    sessionStorage.setItem(UI_BARBER_PAGE_KEY, page)
  }, [page])

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-rule pb-5">
          <img
            src={barber.photo}
            alt=""
            className="h-14 w-14 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{SHOP_NAME}</p>
            <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight">
              {barber.name}
            </h1>
            <p className="text-sm text-soft">{barber.specialty}</p>
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="font-display text-[11px] uppercase tracking-[0.16em] text-soft hover:text-off"
          >
            Add walk-in
          </button>
        </div>

        <nav className="mt-5 flex gap-5" aria-label="Barber">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className={`font-display text-[11px] uppercase tracking-[0.18em] ${
                page === item.id ? 'text-off' : 'text-mid hover:text-soft'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {page === 'current' ? (
        <section>
          <div className="relative min-h-[72svh] overflow-hidden">
            <img
              src="/images/chair.jpg"
              alt=""
              className="kenburns-slow absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
            <div className="relative flex min-h-[72svh] flex-col justify-end px-5 pb-10 pt-16 sm:px-8">
              {current ? (
                <>
                  <p className="eyebrow text-soft">
                    {current.status === 'serving' ? 'Now in chair' : 'Called'}
                  </p>
                  <p className="font-display mt-4 text-sm tracking-[0.16em] text-soft">
                    {formatQueueNumber(current.number)}
                  </p>
                  <h2 className="font-display mt-2 text-5xl font-semibold tracking-tight text-paper sm:text-6xl">
                    {current.customerName}
                  </h2>
                  <p className="mt-4 text-lg text-off">
                    {current.service}
                    <span className="mx-2 text-mid">/</span>
                    {formatMoney(current.price)}
                  </p>
                  <div className="mt-4">
                    <PaymentBadge status={current.paymentStatus} />
                  </div>
                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    {current.status === 'serving' ? (
                      <button
                        type="button"
                        onClick={() => completeTicket(current.id)}
                        className="font-display text-[12px] uppercase tracking-[0.2em] text-paper hover:text-soft"
                      >
                        Complete →
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canStart(tickets, current)}
                        onClick={() => startService(current.id)}
                        className="font-display text-[12px] uppercase tracking-[0.2em] text-paper hover:text-soft disabled:opacity-40"
                      >
                        Start →
                      </button>
                    )}
                    {current.status === 'serving' ? null : (
                      <button
                        type="button"
                        onClick={() => markNoShow(current.id)}
                        className="font-display text-[12px] uppercase tracking-[0.2em] text-soft hover:text-stop"
                      >
                        No show
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="eyebrow text-soft">Chair</p>
                  <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
                    The chair is free.
                  </h2>
                  <p className="mt-4 max-w-md text-soft">
                    {next
                      ? `Call ${next.customerName} when you are ready.`
                      : 'No one waiting. Add a walk-in when someone arrives.'}
                  </p>
                </>
              )}
            </div>
          </div>

          {next ? (
            <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
              <div className="flex flex-wrap items-end justify-between gap-3 border-t border-rule pt-5">
                <div>
                  <p className="eyebrow">Next up</p>
                  <p className="font-display mt-2 text-2xl font-medium">
                    {formatQueueNumber(next.number)} — {next.customerName}
                  </p>
                  <p className="mt-1 text-sm text-soft">
                    {next.service} · waiting {minutesSince(next.joinedAt)} min
                  </p>
                </div>
                <div>
                  {canCall(tickets, next) ? (
                    <button
                      type="button"
                      onClick={() => callTicket(next.id)}
                      className="font-display text-[12px] uppercase tracking-[0.2em] text-paper hover:text-soft"
                    >
                      Call next →
                    </button>
                  ) : (
                    <p className="max-w-xs text-sm text-mid">
                      {callBlockedReason(tickets, next) || 'Serve customers in queue order.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {page === 'queue' ? (
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">Queue</h2>
            <p className="eyebrow">{waiting.length} waiting</p>
          </div>
          {queue.length === 0 ? (
            <p className="mt-8 text-soft">No one waiting. Add a walk-in when someone arrives.</p>
          ) : (
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {queue.map((t) => {
                const reason = t.status === 'waiting' ? callBlockedReason(tickets, t) : null
                const first = firstWaiting(tickets, t.barberId)
                const isFirst = Boolean(t.status === 'waiting' && first && first.id === t.id)
                return (
                  <li key={t.id} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg">
                          {formatQueueNumber(t.number)} — {t.customerName}
                        </p>
                        <p className="mt-1 text-sm text-soft">
                          {t.service} · waiting {minutesSince(t.joinedAt)} min
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={t.status} />
                        <PaymentBadge status={t.paymentStatus} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {isFirst ? (
                        <PrimaryButton
                          disabled={!canCall(tickets, t)}
                          onClick={() => callTicket(t.id)}
                        >
                          Call
                        </PrimaryButton>
                      ) : t.status === 'waiting' ? (
                        <p className="text-sm text-mid">Serve customers in queue order.</p>
                      ) : null}
                      {t.status === 'called' ? (
                        <PrimaryButton
                          disabled={!canStart(tickets, t)}
                          onClick={() => startService(t.id)}
                        >
                          Start
                        </PrimaryButton>
                      ) : null}
                      {t.status === 'waiting' || t.status === 'called' ? (
                        <DangerButton onClick={() => markNoShow(t.id)}>No show</DangerButton>
                      ) : null}
                    </div>
                    {reason && !isFirst ? null : reason && isFirst ? (
                      <p className="mt-2 text-sm text-mid">{reason}</p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : null}

      {page === 'history' ? (
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">Today</h2>
            <p className="font-display text-xl">{formatMoney(revenue)}</p>
          </div>
          {done.length === 0 ? (
            <p className="mt-8 text-soft">No completed cuts yet today.</p>
          ) : (
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {done
                .slice()
                .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                .map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">
                        {formatQueueNumber(t.number)} {t.customerName}
                      </p>
                      <p className="text-sm text-soft">{t.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display">{formatMoney(t.price)}</p>
                      <PaymentBadge status={t.paymentStatus} />
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      ) : null}

      {adding ? <AddCustomer barberId={barber.id} onClose={() => setAdding(false)} /> : null}
    </div>
  )
}
