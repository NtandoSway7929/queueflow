import { useEffect, useState } from 'react'
import {
  BARBERS,
  SHOP_LOCATION,
  SHOP_NAME,
  UI_OWNER_PAGE_KEY,
} from '../constants'
import {
  completedToday,
  customersToday,
  formatMoney,
  formatQueueNumber,
  paymentCounts,
  revenueToday,
  servingTicket,
  waitingTickets,
  firstWaiting,
} from '../store'
import QRPlaceholder from './QRPlaceholder'
import { PaymentBadge, StatusBadge } from './ui'

const ACTIVE = ['waiting', 'called', 'serving']

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'floor', label: 'Live floor' },
  { id: 'barbers', label: 'Barbers' },
  { id: 'payments', label: 'Payments' },
]

function readPage() {
  const saved = sessionStorage.getItem(UI_OWNER_PAGE_KEY)
  if (NAV.some((n) => n.id === saved)) return saved
  return 'overview'
}

function Tick({ value }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const isMoney = typeof value === 'string'
    const target = isMoney ? Number(String(value).replace(/[^0-9]/g, '')) : Number(value) || 0
    let i = 0
    const frames = 14
    const t = setInterval(() => {
      i += 1
      const next = Math.round(target * (i / frames))
      setN(next)
      if (i >= frames) {
        setN(target)
        clearInterval(t)
      }
    }, 28)
    return () => clearInterval(t)
  }, [value])
  if (typeof value === 'string' && String(value).startsWith('R')) return `R${n}`
  return n
}

export default function OwnerView({ state }) {
  const [page, setPage] = useState(readPage)
  const { tickets } = state
  const waiting = tickets.filter((t) => t.status === 'waiting' || t.status === 'called').length
  const serving = tickets.filter((t) => t.status === 'serving').length
  const done = completedToday(tickets)
  const revenue = revenueToday(tickets)
  const today = customersToday(tickets)
  const live = tickets
    .filter((t) => ACTIVE.includes(t.status))
    .sort((a, b) => a.number - b.number)
  const counts = paymentCounts(tickets)

  useEffect(() => {
    sessionStorage.setItem(UI_OWNER_PAGE_KEY, page)
  }, [page])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="eyebrow">{SHOP_NAME}</p>
      <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Operations
      </h1>
      <p className="mt-2 text-soft">
        Today · {SHOP_LOCATION}
      </p>

      <nav className="mt-6 flex flex-wrap gap-5 border-b border-rule pb-4" aria-label="Owner">
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

      {page === 'overview' ? (
        <div className="mt-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-rule py-8 sm:grid-cols-4">
            <div>
              <p className="eyebrow">Customers today</p>
              <p className="stat-tick font-display mt-2 text-4xl font-semibold sm:text-5xl">
                <Tick value={today.length} />
              </p>
            </div>
            <div>
              <p className="eyebrow">Waiting</p>
              <p className="stat-tick font-display mt-2 text-4xl font-semibold sm:text-5xl">
                <Tick value={waiting} />
              </p>
            </div>
            <div>
              <p className="eyebrow">Barbers active</p>
              <p className="stat-tick font-display mt-2 text-4xl font-semibold sm:text-5xl">
                <Tick value={serving} />
              </p>
            </div>
            <div>
              <p className="eyebrow">Revenue</p>
              <p className="stat-tick font-display mt-2 text-4xl font-semibold sm:text-5xl">
                <Tick value={formatMoney(revenue)} />
              </p>
            </div>
          </div>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.16em] text-soft">
            {serving} in chair · {waiting} waiting
          </p>
          <p className="mt-2 text-sm text-mid">{done.length} completed today.</p>
          <div className="mt-16 -mx-4 sm:-mx-6">
            <QRPlaceholder />
          </div>
        </div>
      ) : null}

      {page === 'floor' ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold">Live floor</h2>
          <p className="mt-1 text-sm text-mid">Who is in the chair. Who is next.</p>
          <p className="mt-3 font-display text-sm uppercase tracking-[0.16em] text-soft">
            {serving} in chair · {waiting} waiting
          </p>
          <div className="-mx-4 mt-8 border-y border-rule sm:-mx-6">
            {BARBERS.map((barber) => {
              const servingNow = servingTicket(tickets, barber.id)
              const next = firstWaiting(tickets, barber.id)
              const w = waitingTickets(tickets, barber.id)
              const status = servingNow ? 'With client' : 'Available'
              return (
                <article
                  key={barber.id}
                  className="flex border-b border-rule last:border-b-0"
                >
                  <img
                    src={barber.photo}
                    alt=""
                    className="h-52 w-36 shrink-0 object-cover sm:h-72 sm:w-56"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-5 sm:px-8">
                    <p className="eyebrow">{status}</p>
                    <h3 className="font-display mt-2 text-3xl font-semibold tracking-tight">
                      {barber.name}
                    </h3>
                    <p className="mt-1 text-sm text-soft">{barber.specialty}</p>
                    <div className="mt-4 text-sm">
                      {servingNow ? (
                        <p>
                          {servingNow.customerName}
                          <span className="text-mid"> · {servingNow.service}</span>
                        </p>
                      ) : (
                        <p className="text-soft">Chair free</p>
                      )}
                      <p className="mt-1 text-soft">
                        Next{' '}
                        {next ? (
                          <span className="text-off">
                            {formatQueueNumber(next.number)} {next.customerName}
                          </span>
                        ) : (
                          '—'
                        )}
                        <span className="text-mid"> · {w.length} waiting</span>
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {live.length === 0 ? (
              <li className="py-8 text-center text-soft">No one on the floor right now.</li>
            ) : (
              live.map((t) => {
                const barber = BARBERS.find((b) => b.id === t.barberId)
                return (
                  <li key={t.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                    <p className="font-display text-lg">
                      {formatQueueNumber(t.number)}
                      <span className="ml-3 font-sans text-base">{t.customerName}</span>
                    </p>
                    <p className="text-sm text-soft">
                      {barber?.name} · {t.service}
                    </p>
                    <StatusBadge status={t.status} />
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}

      {page === 'barbers' ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold">Barber performance</h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {BARBERS.map((barber) => {
              const c = completedToday(tickets, barber.id).length
              const r = revenueToday(tickets, barber.id)
              const s = servingTicket(tickets, barber.id)
              return (
                <li key={barber.id} className="flex items-center gap-4 py-5">
                  <img src={barber.photo} alt="" className="h-16 w-16 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl font-semibold">{barber.name}</p>
                    <p className="text-sm text-soft">{barber.specialty}</p>
                    {s ? (
                      <p className="mt-1 text-sm text-off">With {s.customerName}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl">{c}</p>
                    <p className="eyebrow">Completed</p>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-display text-2xl">{formatMoney(r)}</p>
                    <p className="eyebrow">Revenue</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {page === 'payments' ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold">Payments</h2>
          <p className="mt-2 max-w-lg text-sm text-mid">
            Today&apos;s tickets by method. Pending does not count as revenue.
            This demo cannot verify a bank transaction.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-rule py-8 sm:grid-cols-5">
            {[
              { key: 'pending', label: 'Pending', value: counts.pending, tone: 'text-wait' },
              { key: 'cash', label: 'Cash', value: counts.cash, tone: 'text-go' },
              { key: 'card', label: 'Card', value: counts.card, tone: 'text-go' },
              { key: 'eft', label: 'EFT', value: counts.eft, tone: 'text-go' },
              { key: 'paid', label: 'Paid', value: counts.paid, tone: 'text-go' },
            ].map((p) => (
              <div key={p.key}>
                <p className="eyebrow">{p.label}</p>
                <p className={`font-display mt-2 text-4xl font-semibold ${p.tone}`}>{p.value}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {tickets
              .filter((t) => ACTIVE.includes(t.status) || t.status === 'completed')
              .sort((a, b) => b.number - a.number)
              .slice(0, 16)
              .map((t) => {
                const barber = BARBERS.find((b) => b.id === t.barberId)
                return (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <p>
                      {formatQueueNumber(t.number)} {t.customerName}
                      <span className="ml-2 text-sm text-mid">{barber?.name}</span>
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-soft">{formatMoney(t.price)}</span>
                      <PaymentBadge status={t.paymentStatus} />
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
