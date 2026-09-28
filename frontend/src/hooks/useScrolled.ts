import { useEffect, useState } from 'react'

/** True once the page has scrolled past `offset` pixels. Used by the navbar. */
export function useScrolled(offset = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}
