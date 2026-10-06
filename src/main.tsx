import { lazy, StrictMode, Suspense, useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'
import { MobileLanding } from './components/MobileLanding'
import { PromoBar } from './components/PromoBar'
import './styles.css'

// Both pages pull in three.js and MediaPipe. Loading them lazily keeps them out of the
// entry bundle, so a phone, which only ever sees MobileLanding, never downloads them.
const App = lazy(() => import('./App'))
const Game = lazy(() => import('./game/Game'))

function subscribeHash(listener: () => void): () => void {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

/** Matches the 1024px breakpoint in styles.css below which the demo is replaced. */
const smallScreen = window.matchMedia('(max-width: 1023px)')

function subscribeScreen(listener: () => void): () => void {
  smallScreen.addEventListener('change', listener)
  return () => smallScreen.removeEventListener('change', listener)
}

/** Hash routing: `#game` needs no server rewrite on a static host. */
function Root() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash)
  const small = useSyncExternalStore(subscribeScreen, () => smallScreen.matches)
  return (
    <>
      <PromoBar />
      {small ? (
        <MobileLanding />
      ) : (
        <Suspense fallback={null}>{hash === '#game' ? <Game /> : <App />}</Suspense>
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
