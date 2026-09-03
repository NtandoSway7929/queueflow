function cell(row, col) {
  const finder = (r, c, originR, originC) => {
    const rr = r - originR
    const cc = c - originC
    if (rr < 0 || rr > 6 || cc < 0 || cc > 6) return null
    if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true
    if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true
    return false
  }
  const inFinder =
    finder(row, col, 0, 0) ?? finder(row, col, 0, 18) ?? finder(row, col, 18, 0)
  if (inFinder !== null) return inFinder
  if (row === 6 || col === 6) return (row + col) % 2 === 0
  const n = (row * 17 + col * 13 + row * col) % 7
  return n === 0 || n === 3 || ((row + col) % 5 === 0 && n !== 1)
}

export default function QRPlaceholder() {
  const size = 25
  const cells = []
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (cell(r, c)) cells.push(`${c},${r}`)
    }
  }

  return (
    <aside className="relative overflow-hidden">
      <img
        src="/images/tools.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative px-5 py-10 sm:px-8 sm:py-12">
        <p className="eyebrow text-soft">Join the queue</p>
        <h2 className="font-display mt-3 max-w-sm text-2xl font-semibold tracking-tight text-paper">
          Scan to join from your phone
        </h2>
        <div className="mt-8 inline-block bg-paper p-3">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-32 w-32 sm:h-36 sm:w-36"
            role="img"
            aria-label="Placeholder QR code"
          >
            <rect width={size} height={size} fill="#F3F3F1" />
            {cells.map((key) => {
              const [c, r] = key.split(',').map(Number)
              return <rect key={key} x={c} y={r} width="1" height="1" fill="#0A0A0A" />
            })}
          </svg>
        </div>
        <p className="mt-8 font-display text-[11px] uppercase tracking-[0.22em] text-soft">
          Place at
        </p>
        <p className="mt-2 font-display text-sm tracking-wide text-paper">
          Reception · Mirrors · Waiting area
        </p>
      </div>
    </aside>
  )
}
