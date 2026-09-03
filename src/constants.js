const IMAGE_BASE = `${import.meta.env.BASE_URL}images/`

export const SHOP_NAME = 'Fade District'
export const SHOP_LOCATION = 'Johannesburg'
export const BRAND_NAME = 'QueueFlow'
export const CREDIT = 'Powered by Swayphics'
export const DEMO_BADGE = 'Demo Mode'
export const DEMO_LIVE_LABEL = 'Simulated live queue'
export const WAIT_ESTIMATE_NOTE = 'Estimated using average service time.'
export const STORAGE_KEY = 'queueflow-demo-v3'
export const SYNC_EVENT = 'queueflow-sync'
export const WAIT_MINUTES_PER_POSITION = 12
export const UI_MODE_KEY = 'queueflow-ui-mode'
export const UI_BARBER_KEY = 'queueflow-ui-barber'
export const UI_CUSTOMER_PAGE_KEY = 'queueflow-ui-customer-page'
export const UI_BARBER_PAGE_KEY = 'queueflow-ui-barber-page'
export const UI_OWNER_PAGE_KEY = 'queueflow-ui-owner-page'

export const BARBERS = [
  {
    id: 'thabo',
    name: 'Thabo',
    specialty: 'Fade Specialist',
    photo: `${IMAGE_BASE}barbers/thabo.jpg`,
  },
  {
    id: 'sizwe',
    name: 'Sizwe',
    specialty: 'Classic Cuts',
    photo: `${IMAGE_BASE}barbers/sizwe.jpg`,
  },
  {
    id: 'kabelo',
    name: 'Kabelo',
    specialty: 'Fades & Beard',
    photo: `${IMAGE_BASE}barbers/kabelo.jpg`,
  },
  {
    id: 'neo',
    name: 'Neo',
    specialty: 'Kids & Classic',
    photo: `${IMAGE_BASE}barbers/neo.jpg`,
  },
]

export const HERO_IMAGE = `${IMAGE_BASE}hero.jpg`
export const GRAIN_IMAGE = `${IMAGE_BASE}grain.png`

export const SERVICES = [
  { id: 'haircut', name: 'Haircut', price: 80 },
  { id: 'haircut-beard', name: 'Haircut + Beard', price: 120 },
  { id: 'beard', name: 'Beard', price: 50 },
  { id: 'kids', name: 'Kids Haircut', price: 60 },
]

export const SA_NAMES = [
  'Sipho',
  'Amahle',
  'Lebo',
  'Mandla',
  'Zanele',
  'Thandi',
  'Kagiso',
  'Nomsa',
  'Bongani',
  'Lindiwe',
  'Pieter',
  'Fatima',
  'Yusuf',
  'Naledi',
  'Sibusiso',
  'Precious',
  'Andile',
  'Karabo',
  'Palesa',
  'Tshepo',
  'Dumisani',
  'Refilwe',
  'Jabulani',
  'Ayanda',
  'Lesedi',
  'Mpho',
  'Khanyisile',
  'Zinhle',
  'Thabo',
  'Nkosazana',
]

export const PAID_METHODS = ['paid', 'cash', 'card', 'eft']

export const ACTIVE_STATUSES = ['waiting', 'called', 'serving']
