import { useEffect, useState } from 'react'

function formatJhb(date) {
  return new Intl.DateTimeFormat('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export default function ShopAtmosphere() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="font-display text-[11px] font-medium uppercase tracking-[0.16em] text-mid tabular-nums">
      {formatJhb(now)} JHB
    </span>
  )
}
