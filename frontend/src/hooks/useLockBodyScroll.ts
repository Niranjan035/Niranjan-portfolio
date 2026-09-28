import { useEffect } from 'react'

/** Locks body scroll while the mobile navigation drawer is open. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.classList.add('is-locked')
    return () => {
      document.body.classList.remove('is-locked')
      document.body.style.overflow = previous
    }
  }, [locked])
}
