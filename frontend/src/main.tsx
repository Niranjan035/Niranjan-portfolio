import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root was not found in index.html')
}

// The no-js class is removed immediately: if this script runs, JS is available,
// so scroll-reveal content is allowed to animate in.
document.documentElement.classList.remove('no-js')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
