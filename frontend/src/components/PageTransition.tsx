import type { ReactNode } from 'react'

/**
 * PageTransition — a short fade + slide applied to each route's content.
 *
 * Uses a keyed wrapper so React remounts the subtree on navigation, which
 * restarts the animation. `prefers-reduced-motion` disables it in CSS.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}
