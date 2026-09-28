import type { SkillCategory } from '../data/portfolio'
import { Reveal } from './Reveal'

export interface SkillCardProps {
  category: SkillCategory
  /** Number of items in the category, shown as monospace metadata. */
  count: number
}

/**
 * SkillCard — lists technologies in a category.
 *
 * Deliberately no proficiency bars, percentages, or star ratings: levels are
 * not stated anywhere in the portfolio data because they are not known.
 */
export function SkillCard({ category, count }: SkillCardProps) {
  return (
    <Reveal className="skill-card" as="article">
      <div className="cluster" style={{ justifyContent: 'space-between' }}>
        <span className="skill-card__label">{category.label}</span>
        <span className="skill-card__label" aria-hidden="true">
          {String(count).padStart(2, '0')}
        </span>
      </div>
      <h3 className="skill-card__title">{category.title}</h3>
      <p className="skill-card__desc">{category.description}</p>
      <ul className="skill-card__items">
        {category.items.map((item) => (
          <li key={item}>
            <span className="chip">{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
