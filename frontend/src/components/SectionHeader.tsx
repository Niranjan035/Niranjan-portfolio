import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

export interface SectionHeaderProps {
  /** Monospace label, e.g. "01 — FEATURED PROJECT". Rendered above the title. */
  label?: string
  title: ReactNode
  /** Title renders as <h2> by default. Use h1 on page intros. */
  as?: 'h1' | 'h2' | 'h3'
  titleClass?: string
  body?: ReactNode
  actions?: ReactNode
  /** Right-aligns a trailing block on wide screens (e.g. a "View all" button). */
  split?: boolean
  id?: string
  className?: string
}

export function SectionHeader({
  label,
  title,
  as: Tag = 'h2',
  titleClass = 'display-l',
  body,
  actions,
  split = false,
  id,
  className,
}: SectionHeaderProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  const classes = [
    'section-header',
    split ? 'section-header--split' : '',
    'reveal',
    visible ? 'reveal--visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes}>
      <div className="stack stack--4" style={{ flex: '1 1 24rem', minWidth: 0 }}>
        {label ? <span className="label label-dot label--accent">{label}</span> : null}
        <Tag id={id} className={`${titleClass} section-header__title`}>
          {title}
        </Tag>
        {body ? <div className="section-header__body">{body}</div> : null}
      </div>
      {actions ? <div className="cluster cluster--sm">{actions}</div> : null}
    </div>
  )
}
