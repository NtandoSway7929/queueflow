import { BARBERS, CREDIT, DEMO_BADGE } from '../constants'
import { resetDemo } from '../store'
import ShopAtmosphere from './ShopAtmosphere'

const MODES = [
  { id: 'customer', label: 'Customer' },
  { id: 'barber', label: 'Barber' },
  { id: 'owner', label: 'Owner' },
]

export default function Chrome({ mode, setMode, barberId, setBarberId }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ink">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        <span className="eyebrow text-mid">{DEMO_BADGE}</span>
        <ShopAtmosphere />
        <nav className="flex items-center gap-3" aria-label="Demo role">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`font-display text-[11px] font-medium uppercase tracking-[0.16em] ${
                mode === item.id ? 'text-off' : 'text-mid hover:text-soft'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {mode === 'barber' ? (
          <div className="flex items-center gap-3" aria-label="Select barber">
            {BARBERS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBarberId(b.id)}
                className={`font-display text-[11px] font-medium uppercase tracking-[0.16em] ${
                  barberId === b.id ? 'text-off' : 'text-mid hover:text-soft'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset the demo to the seeded Johannesburg shop queues?')) {
                resetDemo()
              }
            }}
            className="font-display text-[11px] font-medium uppercase tracking-[0.16em] text-mid hover:text-soft"
          >
            Reset
          </button>
          <span className="hidden text-[10px] tracking-wide text-mid sm:inline">{CREDIT}</span>
        </div>
      </div>
    </header>
  )
}
