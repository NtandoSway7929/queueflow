const ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'barbers', label: 'Barbers' },
  { id: 'queue', label: 'My Queue' },
  { id: 'visit', label: 'My Visit' },
]

export default function BottomNav({ page, setPage, alert }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-ink pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Customer"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className={`relative min-h-14 px-1 py-3 font-display text-[10px] font-medium uppercase tracking-[0.16em] ${
                active ? 'text-off' : 'text-mid'
              }`}
            >
              {item.label}
              {item.id === 'queue' && alert ? (
                <span className="absolute right-3 top-2 h-1.5 w-1.5 rounded-sm bg-off" />
              ) : null}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
