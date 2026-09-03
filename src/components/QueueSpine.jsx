import { formatQueueNumber } from '../store'

function firstName(name) {
  return (name || '').trim().split(/\s+/)[0]
}

function TicketMark({ you }) {
  return (
    <span
      className={`absolute -left-6 top-1.5 h-2 w-2 rounded-sm ${you ? 'bg-off' : 'bg-raised'}`}
    />
  )
}

export default function QueueSpine({ serving, waiting, you }) {
  const youId = you?.id
  const youInLine = you && you.status === 'waiting'
  const ahead = waiting.filter((t) => t.id !== youId && t.number < (you?.number ?? Infinity))
  const behind = waiting.filter((t) => t.id !== youId && t.number > (you?.number ?? -Infinity))

  return (
    <ol className="relative mt-8 pl-6">
      <span className="absolute bottom-2 left-[7px] top-2 w-px bg-raised" aria-hidden />

      {serving ? (
        <li key={serving.id} className="spine-item relative mb-5">
          <TicketMark />
          <p className="now-serving-pulse eyebrow">Now serving</p>
          <p className="font-display mt-1 text-xl text-off">
            {formatQueueNumber(serving.number)}
            <span className="ml-2 text-sm font-normal text-soft">
              {firstName(serving.customerName)}
            </span>
          </p>
        </li>
      ) : null}

      {ahead.map((t) => (
        <li key={t.id} className="spine-item relative mb-4">
          <TicketMark />
          <p className="font-display text-lg tracking-wide text-soft">
            {formatQueueNumber(t.number)}
          </p>
        </li>
      ))}

      {youInLine ? (
        <li key={you.id} className="spine-item relative mb-4">
          <TicketMark you />
          <p className="eyebrow text-off">You</p>
          <p className="font-display mt-1 text-3xl font-semibold text-paper">
            {formatQueueNumber(you.number)}
          </p>
        </li>
      ) : null}

      {behind.map((t) => (
        <li key={t.id} className="spine-item relative mb-4">
          <TicketMark />
          <p className="font-display text-lg tracking-wide text-mid">
            {formatQueueNumber(t.number)}
          </p>
        </li>
      ))}
    </ol>
  )
}
