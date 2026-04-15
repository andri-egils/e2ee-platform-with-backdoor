import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Demo from './demo/Demo.tsx'

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemoMode ? <Demo /> : <App />}
  </StrictMode>,
)
