import { Award, Medal, Trophy, MapPin } from 'lucide-react'
import type { Achievement } from '../data/portfolio'

const ICONS = [Trophy, Medal, Award, MapPin]

export function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = ICONS[index % ICONS.length] ?? Trophy

  return (
    <article className="achievement-card">
      <span className="achievement-card__icon">
        <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h3 className="achievement-card__title">{achievement.title}</h3>
      <p className="achievement-card__scope">{achievement.scope}</p>
      <p className="achievement-card__detail">{achievement.detail}</p>
    </article>
  )
}
