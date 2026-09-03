import { useState } from 'react'
import { formatMoney, payTicket } from '../store'
import { PaymentBadge, PrimaryButton } from './ui'

const METHODS = [
  { id: 'card', label: 'Card' },
  { id: 'eft', label: 'EFT' },
  { id: 'cash', label: 'Cash at shop' },
]

export default function PaymentPanel({ ticket }) {
  const [busy, setBusy] = useState(null)
  const [picked, setPicked] = useState(
    ticket.paymentStatus === 'pending' ? 'card' : ticket.paymentStatus,
  )
  const pending = ticket.paymentStatus === 'pending'

  async function confirm() {
    const method = picked || 'card'
    setBusy(method)
    await new Promise((r) => setTimeout(r, 700))
    payTicket(ticket.id, method)
    setBusy(null)
  }

  return (
    <section className="border-y border-rule py-6">
      <p className="eyebrow">Your service</p>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-medium text-off">{ticket.service}</h2>
        <p className="font-display text-2xl text-paper">{formatMoney(ticket.price)}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-rule pt-4">
        <p className="eyebrow">Status</p>
        <PaymentBadge status={ticket.paymentStatus} />
      </div>

      <p className="mt-4 text-sm text-mid">Demo payment — no real money is processed.</p>

      {pending ? (
        <div className="mt-5">
          <p className="eyebrow mb-3">Payment</p>
          <div className="grid gap-2">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 ${
                  picked === m.id ? 'border-soft bg-raised' : 'border-rule'
                }`}
              >
                <input
                  type="radio"
                  name="pay-method"
                  value={m.id}
                  checked={picked === m.id}
                  onChange={() => setPicked(m.id)}
                  className="accent-off"
                />
                <span className="text-sm font-medium text-off">{m.label}</span>
              </label>
            ))}
          </div>
          <PrimaryButton className="mt-4 w-full" disabled={Boolean(busy)} onClick={confirm}>
            {busy ? 'Recording…' : 'Confirm payment'}
          </PrimaryButton>
        </div>
      ) : (
        <p className="mt-4 text-sm text-go">Recorded in this demo only.</p>
      )}
    </section>
  )
}
