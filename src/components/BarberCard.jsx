import { WAIT_ESTIMATE_NOTE } from '../constants'
import {
  formatWait,
  isBusy,
  servingTicket,
  waitIfJoining,
  waitingTickets,
} from '../store'
import { AvailabilityType } from './ui'

export default function BarberCard({ barber, tickets, index, onJoin, disabled }) {
  const waiting = waitingTickets(tickets, barber.id)
  const serving = servingTicket(tickets, barber.id)
  const busy = isBusy(tickets, barber.id)
  const wait = waitIfJoining(tickets, barber.id)
  const inQueue = waiting.length + (serving ? 1 : 0)

  return (
    <article
      className="rise-in relative min-h-[88svh] overflow-hidden sm:min-h-[78vh]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <img
        src={barber.photo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-24 sm:px-7 sm:pb-10">
        <p className="eyebrow text-soft">{barber.specialty}</p>
        <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          {barber.name}
        </h2>
        <p className="font-display mt-5 text-[12px] uppercase tracking-[0.16em] text-soft">
          {inQueue} in queue
          <span className="mx-2 text-mid">·</span>
          Est. wait {formatWait(wait).replace('~', '')}
        </p>
        <p className="mt-2 text-xs text-mid">{WAIT_ESTIMATE_NOTE}</p>
        <div className="mt-4">
          <AvailabilityType busy={busy} />
        </div>
        <button
          type="button"
          onClick={() => onJoin(barber)}
          disabled={disabled}
          className="mt-7 font-display text-[12px] uppercase tracking-[0.2em] text-paper transition hover:text-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Join queue →
        </button>
      </div>
    </article>
  )
}
