import { Link } from 'react-router-dom'
import type { Project } from '../data/portfolio'
import { ImagePlaceholder } from './ImagePlaceholder'
import { ExternalArrow } from './icons/SocialIcon'

export interface ProjectCardProps {
  project: Project
  /** Monospace index, e.g. "01". */
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const to = `/projects/${project.slug}`
  const indexLabel = String(index).padStart(2, '0')

  return (
    <article className="project-card">
      <span className="project-card__index" aria-hidden="true">
        {indexLabel}
      </span>

      <div className="project-card__media">
        <ImagePlaceholder
          label={`${project.title.toUpperCase()} — IMAGE`}
          note="Real project photograph to be added."
          src={project.image.src}
          alt={project.image.alt}
          size="sm"
          bare
        />
      </div>

      <div className="project-card__body">
        <div className="project-card__title-row">
          <h3 className="project-card__title">{project.title}</h3>
          <span className="label">{project.type}</span>
        </div>

        <p className="project-card__summary">{project.summary}</p>

        <ul className="chip-list" aria-label={`${project.title} key components`}>
          {project.tags.map((tag) => (
            <li key={tag}>
              <span className="chip">{tag}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="project-card__footer">
        <Link
          className="btn btn--secondary btn--sm"
          to={to}
          aria-label={`View the ${project.title} project`}
        >
          View Project
          <span className="btn__icon">
            <ExternalArrow size={14} strokeWidth={1.75} className="btn__icon" />
          </span>
        </Link>
        <span className="label">Case study</span>
      </div>
    </article>
  )
}
