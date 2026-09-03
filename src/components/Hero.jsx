import { SHOP_NAME, HERO_IMAGE } from '../constants'
import { PrimaryButton } from './ui'

export default function Hero({ onJoin }) {
  return (
    <section className="relative min-h-[calc(100svh-7rem)] overflow-hidden bg-ink">
      <img
        src={HERO_IMAGE}
        alt=""
        className="kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-end px-5 pb-10 pt-16 sm:px-8">
        <p className="eyebrow text-soft">{SHOP_NAME}</p>
        <h1 className="font-display mt-5 text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-paper sm:text-6xl">
          YOUR CHAIR.
          <br />
          YOUR BARBER.
          <br />
          YOUR TIME.
        </h1>
        <p className="mt-6 max-w-sm text-base text-soft">Join the queue from your phone.</p>
        <PrimaryButton className="mt-8 w-full max-w-xs" onClick={onJoin}>
          See the barbers
        </PrimaryButton>
      </div>
    </section>
  )
}
