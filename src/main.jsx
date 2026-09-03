import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const BASE_URL = import.meta.env.BASE_URL
const imageBase = `${BASE_URL}images/`

const originalSetAttribute = Element.prototype.setAttribute
Element.prototype.setAttribute = function (name, value) {
  if (this instanceof HTMLImageElement && name === 'src' && typeof value === 'string' && value.startsWith('/images/')) {
    value = `${BASE_URL}${value.slice(1)}`
  }
  return originalSetAttribute.call(this, name, value)
}

const imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')
if (imageSrc?.set && imageSrc?.get) {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: imageSrc.configurable,
    enumerable: imageSrc.enumerable,
    get: imageSrc.get,
    set(value) {
      imageSrc.set.call(this, typeof value === 'string' && value.startsWith('/images/') ? `${BASE_URL}${value.slice(1)}` : value)
    },
  })
}

document.documentElement.style.setProperty('--qf-grain-image', `url("${imageBase}grain.png")`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
