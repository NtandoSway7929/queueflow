export function StatusBadge({ status }) {
  const map = {
    waiting: { label: 'Waiting', className: 'text-soft' },
    called: { label: 'Called', className: 'text-off' },
    serving: { label: 'In chair', className: 'text-off' },
    completed: { label: 'Completed', className: 'text-go' },
    noshow: { label: 'No show', className: 'text-mid' },
    left: { label: 'Left', className: 'text-mid' },
  }
  const item = map[status] || map.waiting
  return <span className={`eyebrow ${item.className}`}>{item.label}</span>
}

export function PaymentBadge({ status }) {
  const map = {
    pending: { label: 'Pending', className: 'text-wait' },
    cash: { label: 'Cash', className: 'text-go' },
    card: { label: 'Card', className: 'text-go' },
    eft: { label: 'EFT', className: 'text-go' },
    paid: { label: 'Paid', className: 'text-go' },
  }
  const item = map[status] || map.pending
  return <span className={`eyebrow ${item.className}`}>{item.label}</span>
}

export function AvailabilityType({ busy }) {
  return (
    <span className="eyebrow text-soft">
      {busy ? 'With a client' : 'Available'}
    </span>
  )
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] bg-off px-4 py-3 text-sm font-semibold tracking-wide text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border border-rule bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-off transition hover:border-soft disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] px-3 py-2 text-sm font-medium text-soft transition hover:text-off disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border border-rule px-4 py-3 text-sm font-medium text-soft transition hover:border-stop hover:text-stop disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
