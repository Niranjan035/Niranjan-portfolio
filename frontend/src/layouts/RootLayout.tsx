import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ScrollToTop } from '../components/ScrollToTop'
import { RouteFallback } from './RouteFallback'

/**
 * RootLayout — the persistent chrome: fixed navbar, routed content, dark footer.
 *
 * Pages are lazy-loaded (see App.tsx) so the initial bundle stays small; the
 * Suspense boundary shows a minimal, branded fallback while a route loads.
 */
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
