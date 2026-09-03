import { useEffect, useState } from 'react'
import Chrome from './components/Chrome'
import CustomerView from './components/CustomerView'
import BarberView from './components/BarberView'
import OwnerView from './components/OwnerView'
import { BARBERS, CREDIT, UI_BARBER_KEY, UI_MODE_KEY } from './constants'
import { useQueueStore } from './store'

function readMode() {
  const saved = sessionStorage.getItem(UI_MODE_KEY)
  if (saved === 'customer' || saved === 'barber' || saved === 'owner') return saved
  return 'customer'
}

function readBarber() {
  const saved = sessionStorage.getItem(UI_BARBER_KEY)
  if (BARBERS.some((b) => b.id === saved)) return saved
  return 'thabo'
}

export default function App() {
  const state = useQueueStore()
  const [mode, setMode] = useState(readMode)
  const [barberId, setBarberId] = useState(readBarber)

  useEffect(() => {
    sessionStorage.setItem(UI_MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    sessionStorage.setItem(UI_BARBER_KEY, barberId)
  }, [barberId])

  return (
    <div className="min-h-svh bg-canvas text-off">
      <Chrome
        mode={mode}
        setMode={setMode}
        barberId={barberId}
        setBarberId={setBarberId}
      />
      <main>
        {mode === 'barber' ? (
          <BarberView state={state} barberId={barberId} />
        ) : mode === 'owner' ? (
          <OwnerView state={state} />
        ) : (
          <CustomerView state={state} />
        )}
      </main>
      <footer
        className={`border-t border-rule px-4 py-4 text-center sm:px-6 ${
          mode === 'customer' ? 'mb-14' : ''
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.16em] text-mid">{CREDIT}</p>
      </footer>
    </div>
  )
}
