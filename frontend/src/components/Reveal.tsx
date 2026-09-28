import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

export interface RevealProps {
  children: ReactNode
  /** Animate direct children one after another instead of the block itself. */
  stagger?: boolean
  as?: ElementType
  className?: string
  /** Delay in milliseconds, applied after the reveal. */
  delay?: number
}

/**
 * Reveal — wraps content in a scroll-triggered fade + slide-up.
 *
 * Purely decorative: it never gates content behind interaction, and reduced
 * motion is handled in CSS so the content renders immediately.
 */
export function Reveal({ children, stagger = false, as, className, delay }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const Tag = (as ?? 'div') as ElementType

  const classes = [
    stagger ? 'reveal-stagger' : 'reveal',
    visible ? (stagger ? 'reveal-stagger--visible' : 'reveal--visible') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
