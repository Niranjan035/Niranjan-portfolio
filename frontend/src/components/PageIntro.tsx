import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export interface PageIntroProps {
  /** Monospace label above the title, e.g. "01 — ABOUT". */
  label: string
  title: string
  lede?: ReactNode
  /** Optional right-hand slot, e.g. a list of key facts. */
  aside?: ReactNode
  /** Title id, used as the aria-labelledby target. */
  titleId?: string
}

/**
 * PageIntro — the shared header block for every inner page.
 *
 * Always renders exactly one <h1>, giving each page a correct heading hierarchy.
 */
export function PageIntro({ label, title, lede, aside, titleId }: PageIntroProps) {
  return (
    <section className="page__intro">
      <div className="container">
        <div className="page__intro-inner">
          <Reveal>
            <span className="label label-dot label--accent">{label}</span>
          </Reveal>
          <Reveal delay={60}>
            <h1 id={titleId} className="display-l page__title">
              {title}
            </h1>
          </Reveal>
          {lede ? (
            <Reveal delay={120}>
              <p className="lead page__lede">{lede}</p>
            </Reveal>
          ) : null}
          {aside ? <Reveal delay={180}>{aside}</Reveal> : null}
        </div>
      </div>
    </section>
  )
}
