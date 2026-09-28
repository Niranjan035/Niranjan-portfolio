import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { ProjectCard } from '../components/ProjectCard'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { identity, projects } from '../data/portfolio'

export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects"
        description={`Projects by ${identity.name} — including ${projects.map((project) => project.title).join(', ')}.`}
        path="/projects"
      />

      <PageIntro
        label="02 — Projects"
        title="Projects"
        titleId="projects-title"
        lede="A collection of projects I have worked on."
        aside={
          <div className="fact-strip" style={{ maxWidth: '36rem' }}>
            <div className="fact">
              <span className="fact__label">Projects</span>
              <span className="fact__value">{String(projects.length).padStart(2, '0')}</span>
              <span className="fact__note">Published so far</span>
            </div>
            <div className="fact">
              <span className="fact__label">Domain</span>
              <span className="fact__value" style={{ fontSize: '1.25rem' }}>
                Hardware
              </span>
              <span className="fact__note">Flight systems &amp; software</span>
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="project-list-heading">
        <div className="container">
          <SectionHeader
            label="01 — Selected Work"
            title={<span id="project-list-heading">Everything here so far</span>}
            titleClass="display-m"
            body="Only completed work is listed. Projects still in progress are not shown rather than padded out with placeholders."
          />

          <Reveal stagger className="grid grid--2">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </Reveal>

          <Reveal>
            <p className="notice notice--pending" style={{ marginTop: 'var(--sp-7)' }}>
              <span className="notice__icon" aria-hidden="true">
                +
              </span>
              <span>
                More projects will be added as they are finished. The space is left deliberately
                empty rather than filled with work-in-progress listings.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--sunken section--flush-top" aria-labelledby="project-cta-heading">
        <div className="container">
          <div className="split split--equal" style={{ alignItems: 'center' }}>
            <div className="stack stack--4">
              <span className="label label-dot label--accent">Next</span>
              <h2 id="project-cta-heading" className="display-s">
                Have something in mind?
              </h2>
              <p className="lead">
                I am open to work on web applications, backend systems, and anything that
                benefits from being built properly.
              </p>
            </div>
            <div className="cluster cluster--md">
              <Button to="/contact" variant="primary" icon="arrow">
                Get In Touch
              </Button>
              <Button to="/skills" variant="secondary" icon="arrow">
                See Skills
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBand showResume={false} />
    </>
  )
}
