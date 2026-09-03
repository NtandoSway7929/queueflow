import { useEffect, useState } from 'react'
import {
  ACTIVE_STATUSES,
  BARBERS,
  DEMO_LIVE_LABEL,
  SERVICES,
  SHOP_NAME,
  UI_CUSTOMER_PAGE_KEY,
  WAIT_ESTIMATE_NOTE,
} from '../constants'
import {
  dismissCustomerTicket,
  findTicket,
  formatQueueNumber,
  joinQueue,
  leaveQueue,
  queuePosition,
  queueTickets,
  randomName,
  servingTicket,
  waitMinutesForPosition,
} from '../store'
import BarberCard from './BarberCard'
import BottomNav from './BottomNav'
import Hero from './Hero'
import PaymentPanel from './PaymentPanel'
import QueueSpine from './QueueSpine'
import { DangerButton, PrimaryButton, SecondaryButton } from './ui'

const CUSTOMER_PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'barbers', label: 'Barbers' },
  { id: 'queue', label: 'My Queue' },
  { id: 'visit', label: 'My Visit' },
]

function CustomerDeskNav({ page, setPage }) {
  return (
    <nav className="hidden border-b border-rule px-6 py-3 md:flex md:gap-6" aria-label="Customer">
      {CUSTOMER_PAGES.map((item) => (
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
  )
}

function readPage() {
  const saved = sessionStorage.getItem(UI_CUSTOMER_PAGE_KEY)
  if (saved === 'home' || saved === 'barbers' || saved === 'queue' || saved === 'visit') return saved
  return 'home'
}

function JoinSheet({ barber, onClose, onJoined }) {
  const [serviceId, setServiceId] = useState('haircut')
  const [name, setName] = useState(() => randomName())

  function confirm() {
    joinQueue({
      barberId: barber.id,
      serviceId,
      customerName: name,
    })
    onJoined()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/90 sm:items-end">
      <div className="w-full border-t border-rule bg-canvas px-5 pb-8 pt-6 sm:px-8">
        <p className="eyebrow">{SHOP_NAME}</p>
        <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-paper">
          {barber.name}
        </h2>
        <p className="mt-1 text-sm text-soft">{barber.specialty}</p>

        <label className="mt-8 block text-sm font-medium text-off">
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 min-h-11 w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-base text-off outline-none focus:border-soft"
            placeholder="e.g. Sipho"
          />
        </label>

        <p className="mt-8 eyebrow">Service</p>
        <div className="mt-1 divide-y divide-rule border-y border-rule">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setServiceId(s.id)}
              className="flex min-h-12 w-full items-center justify-between py-3 text-left"
            >
              <span className={`font-medium ${serviceId === s.id ? 'text-paper' : 'text-off'}`}>
                {s.name}
              </span>
              <span className={`font-display text-sm ${serviceId === s.id ? 'text-paper' : 'text-soft'}`}>
                R{s.price}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-6 border-t border-rule pt-5">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={confirm} disabled={!name.trim()}>
            Join queue
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function EmptyQueuePrompt({ onBarbers }) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="eyebrow">{SHOP_NAME}</p>
      <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight">
        You&apos;re not in a queue.
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-soft">
        Pick a barber and we&apos;ll give you a number.
      </p>
      <PrimaryButton className="mx-auto mt-8 max-w-xs" onClick={onBarbers}>
        See the barbers
      </PrimaryButton>
    </div>
  )
}

function TicketQueue({ ticket, tickets }) {
  const barber = BARBERS.find((b) => b.id === ticket.barberId)
  const position = queuePosition(tickets, ticket)
  const wait = waitMinutesForPosition(position)
  const serving = servingTicket(tickets, ticket.barberId)
  const line = queueTickets(tickets, ticket.barberId)

  if (ticket.status === 'completed') {
    return (
      <div className="px-5 py-16 text-center">
        <p className="eyebrow text-go">Done</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">
          Thanks for visiting
          <br />
          {SHOP_NAME}.
        </h1>
        <p className="mt-4 text-soft">
          {ticket.service} with {barber?.name}
        </p>
        <PrimaryButton className="mx-auto mt-8 max-w-xs" onClick={() => dismissCustomerTicket()}>
          Back to shop
        </PrimaryButton>
      </div>
    )
  }

  if (ticket.status === 'noshow' || ticket.status === 'left') {
    return (
      <div className="px-5 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {ticket.status === 'noshow' ? 'Marked as no show' : 'You left the queue'}
        </h1>
        <p className="mt-3 text-soft">Join again whenever you are ready.</p>
        <PrimaryButton className="mx-auto mt-8 max-w-xs" onClick={() => dismissCustomerTicket()}>
          Back to shop
        </PrimaryButton>
      </div>
    )
  }

  if (ticket.status === 'called') {
    return (
      <div className="turn-fade relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <img src="/images/haircut.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative">
        <p className="eyebrow">{SHOP_NAME}</p>
        <h1 className="font-display mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-paper sm:text-6xl">
          YOUR TURN
        </h1>
        <p className="mt-6 font-display text-xl uppercase tracking-[0.14em] text-soft">
          {barber?.name} is ready for you.
        </p>
        <p className="mt-10 font-display text-6xl font-semibold text-paper">
          {formatQueueNumber(ticket.number)}
        </p>
        <DangerButton
          className="mt-12 w-full max-w-xs"
          onClick={() => {
            if (window.confirm('Leave the queue? You will lose this number.')) {
              leaveQueue(ticket.id)
            }
          }}
        >
          Leave queue
        </DangerButton>
        </div>
      </div>
    )
  }

  const nextCopy =
    ticket.status === 'serving'
      ? "You're in the chair."
      : position === 1
        ? "You're next"
        : `You are  #${position}  in line`

  return (
    <div className="px-5 py-8 sm:px-8">
      <p className="eyebrow">{SHOP_NAME}</p>
      <p className="mt-2 font-display text-sm uppercase tracking-[0.18em] text-soft">
        {barber?.name}&apos;s queue
      </p>
      <p className="mt-8 eyebrow">Your ticket</p>
      <p className="font-display mt-2 text-7xl font-semibold leading-none tracking-tight text-paper sm:text-8xl">
        {formatQueueNumber(ticket.number)}
      </p>
      <p className="font-display mt-6 text-2xl font-medium tracking-tight text-off">
        {ticket.status === 'serving' ? "You're in the chair." : nextCopy}
      </p>
      {ticket.status === 'waiting' && position === 1 ? (
        <p className="mt-2 text-soft">Get ready.</p>
      ) : null}
      {ticket.status === 'waiting' ? (
        <div className="mt-8 border-t border-rule pt-6">
          <p className="eyebrow">Estimated wait</p>
          <p className="font-display mt-2 text-4xl font-semibold tracking-tight">
            {wait && wait > 0 ? `${wait} MIN` : 'NOW'}
          </p>
          <p className="mt-2 text-sm text-mid">{WAIT_ESTIMATE_NOTE}</p>
        </div>
      ) : ticket.status === 'serving' ? (
        <p className="mt-4 text-soft">Sit back. {barber?.name} has you.</p>
      ) : null}

      {ticket.status === 'waiting' ? (
        <QueueSpine serving={serving} waiting={line} you={ticket} />
      ) : null}

      <p className="mt-8 text-xs text-mid">{DEMO_LIVE_LABEL}</p>

      {ticket.status === 'waiting' || ticket.status === 'called' ? (
        <DangerButton
          className="mt-6 w-full"
          onClick={() => {
            if (window.confirm('Leave the queue? You will lose this number.')) {
              leaveQueue(ticket.id)
            }
          }}
        >
          Leave queue
        </DangerButton>
      ) : null}
    </div>
  )
}

export default function CustomerView({ state }) {
  const [page, setPage] = useState(readPage)
  const [joining, setJoining] = useState(null)
  const ticket = findTicket(state.tickets, state.demoCustomer?.ticketId)
  const active = ticket && ACTIVE_STATUSES.includes(ticket.status)

  useEffect(() => {
    sessionStorage.setItem(UI_CUSTOMER_PAGE_KEY, page)
  }, [page])

  function goBarbers() {
    setPage('barbers')
  }

  return (
    <div className="pb-20 md:pb-0">
      <CustomerDeskNav page={page} setPage={setPage} />
      {page === 'home' ? (
        <>
          <Hero onJoin={goBarbers} />
          <div className="relative h-44 overflow-hidden sm:h-56">
            <img src="/images/tools.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/60" />
            <div className="absolute inset-0 flex items-end px-5 pb-7 sm:px-8 sm:pb-9">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <p className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                  JOHANNESBURG
                </p>
                <p className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                  FOUR CHAIRS
                </p>
                <p className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                  OPEN TODAY
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {page === 'barbers' ? (
        <div>
          <div className="px-5 py-8 sm:px-8">
            <p className="eyebrow">{SHOP_NAME}</p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">
              The chairs.
            </h1>
            <p className="mt-3 max-w-md text-soft">Four barbers. Pick yours. Join from your phone.</p>
          </div>
          <div className="grid sm:grid-cols-2">
            {BARBERS.map((barber, index) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                tickets={state.tickets}
                index={index}
                disabled={Boolean(active)}
                onJoin={(b) => setJoining(b)}
              />
            ))}
          </div>
          {active ? (
            <p className="px-5 py-6 text-center text-sm text-mid">
              You already have a ticket. Open My Queue.
            </p>
          ) : null}
        </div>
      ) : null}

      {page === 'queue' ? (
        ticket ? (
          <TicketQueue ticket={ticket} tickets={state.tickets} />
        ) : (
          <EmptyQueuePrompt onBarbers={goBarbers} />
        )
      ) : null}

      {page === 'visit' ? (
        ticket && (ACTIVE_STATUSES.includes(ticket.status) || ticket.status === 'completed') ? (
          <div className="px-5 py-8 sm:px-8">
            <p className="eyebrow">{SHOP_NAME}</p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">My visit</h1>
            <p className="mt-2 text-sm text-mid">Private to your ticket. Nobody else in the queue sees this.</p>
            <div className="mt-8">
              <PaymentPanel ticket={ticket} />
            </div>
          </div>
        ) : (
          <EmptyQueuePrompt onBarbers={goBarbers} />
        )
      ) : null}

      {joining ? (
        <JoinSheet
          barber={joining}
          onClose={() => setJoining(null)}
          onJoined={() => {
            setJoining(null)
            setPage('queue')
          }}
        />
      ) : null}

      <BottomNav
        page={page}
        setPage={setPage}
        alert={ticket?.status === 'called'}
      />
    </div>
  )
}
