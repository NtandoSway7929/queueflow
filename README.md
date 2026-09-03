# QueueFlow — Fade District

Digital queue for Fade District, a premium Johannesburg barbershop. Built as a Swayphics sales demo.

Not a blue SaaS dashboard. Dark shop surfaces, editorial type, photography. No login. No real payments. No backend. Shop state lives in the browser and stays in sync across tabs.

## Look

Black and charcoal canvas. Space Grotesk headlines, Manrope body. Customer ticket and barber tool are dark. Owner is charcoal with off-white type, not a white card grid.

Customer home is a full-bleed shop photograph with stacked headlines: YOUR CHAIR. YOUR BARBER. YOUR TIME. Join from your phone.

## How to run

Install dependencies, then start the Vite dev server on port 5173.

## Two-tab demo flow

1. Customer, Barbers, join a chair. You land on My Queue with a large ticket number.
2. Open Barber in another tab. The new customer appears.
3. Call only the next guest in line (lowest ticket number). Later tickets stay waiting.
4. Customer sees Your turn.
5. Barber Start, then Complete service.
6. My Visit is the only place a guest sees their own payment.
7. Reset restores the Saturday seed.

## Roles

Demo strip at the top edge switches Customer | Barber | Owner. Discreet. Reset lives there.

- Customer (mobile first): Home, Barbers, My Queue, My Visit. Bottom nav on small screens.
- Barber: Queue, Current client, History. Pick Thabo / Sizwe / Kabelo / Neo in the demo strip.
- Owner: Overview, Live floor, Barbers, Payments.

## Privacy

Customer queue visualization shows ticket numbers (and maybe the now-serving first name). It never shows another customer payment method, status, or provider.

Payment UI is only:
- Customer: My Visit, own ticket only
- Barber: tickets assigned to that barber
- Owner: shop-wide payments

Public queue = numbers + maybe first names. Never payment badges.

## FIFO queue rules

Waiting to Called to Serving (in chair) to Completed.

- A barber can have at most one called ticket.
- Call only the first waiting ticket for that chair, sorted by shop-wide ticket number.
- Start only a called ticket, and only if the chair is empty. Complete only from serving.
- No-show is allowed on waiting or called.
- After complete, the next waiting ticket becomes eligible to call. The app does not auto-call.

Guards live in src/queueRules.js. Do not change those rules.

## State

src/store.js persists to local storage key queueflow-demo-v3 and broadcasts via storage events plus a queueflow-sync custom event.

Wait estimate: 12 minutes times position (waiting + called ahead). Labelled as an estimate using average service time.

Revenue counts completed tickets with cash, card, EFT, or paid. Pending does not count.

Demo payment — no real money is processed. This demo cannot verify a bank transaction.

## Tests

From the project root: npx vite-node scripts/test-queue.mjs

## Photo credits

Local files in public/images/. Not hotlinked. Credits live here only, not in the customer UI.

- Shop interior hero — Unsplash photo-1585747860715-2ba37e788b70
- Haircut in progress — Unsplash photo-1599351431202-1e0f0137899a
- Tools — Unsplash photo-1621605815971-fbc98d665033
- Chair / beard trim — Unsplash photo-1503951914875-452162b0f3f1
- Thabo — Unsplash photo-1566492031773-4f4e44671857
- Sizwe — Pexels 1681010
- Kabelo — Unsplash photo-1463453091185-61582044d556
- Neo — Pexels 3170635

## Stack

React, Vite, Tailwind CSS v4.

## Assumptions

- Fade District is a Joburg demo shop, not a real business.
- Queue numbers are shop-wide; each barber has an independent chair queue.
- First load seeds a busy Saturday so the demo is never empty.
- UI role is per tab so two tabs can play different roles.

## Later backend

Tickets, barbers, payments, auth, and realtime would move to a backend. store.js is the swap point.
