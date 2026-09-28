import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export interface TimelineItemData {
  /** Monospace marker above the title — a year, or a phase label. */
  marker: string
  title: string
  /** Secondary mono metadata, e.g. institution and location. */
  meta?: string[]
  /** Academic score, e.g. { label: 'CGPA', value: '8.64' }. */
  score?: { label: string; value: string }
  body?: string
  children?: ReactNode
}

export function Timeline({ items, labelledBy }: { items: TimelineItemData[]; labelledBy?: string }) {
  return (
    <ol className="timeline" aria-labelledby={labelledBy}>
      {items.map((item) => (
        <TimelineItem key={`${item.marker}-${item.title}`} item={item} />
      ))}
    </ol>
  )
}

export function TimelineItem({ item }: { item: TimelineItemData }) {
  return (
    <li className="timeline__item">
      <Reveal>
        <p className="timeline__year">{item.marker}</p>
        <h3 className="timeline__title">{item.title}</h3>

        {item.meta && item.meta.length > 0 ? (
          <p className="timeline__meta">
            {item.meta.map((entry, index) => (
              <span key={entry} className="cluster cluster--sm" style={{ gap: '0.5rem' }}>
                {index > 0 ? (
                  <span className="timeline__divider" aria-hidden="true">
                    /
                  </span>
                ) : null}
                <span>{entry}</span>
              </span>
            ))}
          </p>
        ) : null}

        {item.score ? (
          <p className="timeline__score">
            <span>{item.score.label}</span>
            <span className="timeline__score-value">{item.score.value}</span>
          </p>
        ) : null}

        {item.body ? <p className="timeline__body">{item.body}</p> : null}
        {item.children}
      </Reveal>
    </li>
  )
}
