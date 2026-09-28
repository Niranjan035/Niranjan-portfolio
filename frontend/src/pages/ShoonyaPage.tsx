import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { getProjectBySlug, identity, type Project } from '../data/portfolio'
import NotFoundPage from './NotFoundPage'

export default function ShoonyaPage() {
  const { slug = '' } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <NotFoundPage />
  return <CaseStudy project={project} />
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <Seo
        title={`${project.title} — ${project.type}`}
        description={`${project.title} is a ${project.type.toLowerCase()} built with ${project.tags.join(', ')}. A case study by ${identity.name}.`}
        type="article"
      />

      {/* ================= Case study hero ================= */}
      <section className="section section--page-top" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Reveal>
            <Link className="label" to="/projects" style={{ marginBottom: 'var(--sp-6)', display: 'inline-flex' }}>
              <ChevronLeft size={13} strokeWidth={1.75} aria-hidden="true" />
              All Projects
            </Link>
          </Reveal>

          <div className="split" style={{ alignItems: 'end', marginBottom: 'clamp(2.5rem, 2rem + 3vw, 4rem)' }}>
            <Reveal>
              <div className="stack stack--5">
                <span className="label label-dot label--accent">Case study</span>
                <h1 className="display-xl" style={{ maxWidth: '14ch' }}>
                  {project.title}
                </h1>
                <p className="lead" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', letterSpacing: '0.04em' }}>
                  {project.type}
                </p>
                <ul className="chip-list" aria-label="Key components">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="chip chip--accent">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="kv">
                {project.keyFacts.map((fact) => (
                  <div className="kv__row" key={fact.label}>
                    <span className="kv__key">{fact.label}</span>
                    <span className="kv__value">{fact.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal>
            <ImagePlaceholder
              label={`${project.title.toUpperCase()} — HERO IMAGE`}
              note="A real photograph of the finished build. Until one is supplied this frame stays deliberately empty."
              src={project.image.src}
              alt={project.image.alt}
              size="xl"
              caption="Hero photograph"
              captionMeta={project.image.src ? undefined : 'Placeholder'}
            />
          </Reveal>
        </div>
      </section>

      {/* ================= Overview ================= */}
      <section className="section" aria-labelledby="overview-heading">
        <div className="container">
          <div className="split">
            <Reveal>
              <SectionHeader
                label="01 — Overview"
                title={<span id="overview-heading">What it is</span>}
                titleClass="display-m"
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="stack stack--4">
                <p className="lead">{project.overview}</p>
                <p className="prose">
                  A fuller write-up — what it was built for, how it was assembled, and what
                  changed along the way — is being written and will be published here. Nothing
                  has been filled in speculatively in the meantime.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Hardware ================= */}
      <section className="section section--sunken" aria-labelledby="hardware-heading">
        <div className="container">
          <SectionHeader
            label="02 — Hardware"
            title={<span id="hardware-heading">Components</span>}
            titleClass="display-m"
            body={project.hardware.intro}
          />

          <Reveal>
            <table className="spec-table">
              <caption>Bill of materials — as built</caption>
              <tbody>
                {project.hardware.table.map((row) => (
                  <tr className="spec-table__row" key={row.component}>
                    <th className="spec-table__cell" scope="row">
                      <span className="spec-table__key">{row.component}</span>
                    </th>
                    <td className="spec-table__cell">
                      <span className="spec-table__value">{row.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ================= Build & setup ================= */}
      <section className="section" aria-labelledby="build-heading">
        <div className="container">
          <SectionHeader
            label="03 — Build & Setup"
            title={<span id="build-heading">Assembly</span>}
            titleClass="display-m"
            body="The four stages of putting the airframe together. Each will be documented with the actual procedure."
          />

          <Reveal stagger className="grid grid--4">
            {project.buildSteps.map((step, index) => (
              <article
                className={`numbered-block${step.pending ? ' numbered-block--pending' : ''}`}
                key={step.title}
              >
                <span className="numbered-block__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="numbered-block__title">{step.title}</h3>
                {step.body ? (
                  <p className="numbered-block__body">{step.body}</p>
                ) : (
                  <>
                    <p className="numbered-block__body text-tertiary">
                      Procedure to be documented.
                    </p>
                    <div className="pending-space" aria-hidden="true" />
                  </>
                )}
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= Engineering challenges ================= */}
      <section className="section section--sunken" aria-labelledby="challenges-heading">
        <div className="container">
          <SectionHeader
            label="04 — Engineering Challenges"
            title={<span id="challenges-heading">Problems and how they were solved</span>}
            titleClass="display-m"
            body="Real obstacles from the build, written up as they occurred."
          />

          {project.challenges.length > 0 ? (
            <div className="grid grid--2">
              {project.challenges.map((challenge, index) => (
                <article className="numbered-block" key={challenge.title}>
                  <span className="numbered-block__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="numbered-block__title">{challenge.title}</h3>
                  <p className="numbered-block__body">{challenge.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="card card--sunken" style={{ gap: 'var(--sp-5)' }}>
                <p className="prose">
                  This section is reserved. Engineering challenges are recorded as they come up
                  during the build, rather than reconstructed afterwards — so it is empty until
                  there is something accurate to put here.
                </p>
                <div className="grid grid--2" aria-hidden="true">
                  <div className="numbered-block numbered-block--pending">
                    <span className="numbered-block__index">01</span>
                    <div className="pending-space" />
                  </div>
                  <div className="numbered-block numbered-block--pending">
                    <span className="numbered-block__index">02</span>
                    <div className="pending-space" />
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ================= Gallery ================= */}
      <section className="section" aria-labelledby="gallery-heading">
        <div className="container">
          <SectionHeader
            label="05 — Gallery"
            title={<span id="gallery-heading">Photographs</span>}
            titleClass="display-m"
            body="Photographs of the finished build: the frame and battery, the wiring, the front camera assembly, and a second angle of the complete quad."
          />

          <Reveal stagger className="gallery">
            {project.gallery.map((image, index) => (
              <figure className="gallery__item" key={`${image.caption}-${index}`}>
                <ImagePlaceholder
                  label={`${String(index + 1).padStart(2, '0')} — ${image.caption.toUpperCase()}`}
                  src={image.src}
                  alt={image.alt}
                  size="sm"
                  bare
                />
                <figcaption className="mono text-tertiary" style={{ marginTop: '0.625rem' }}>
                  {image.caption}
                  {image.src ? null : ' — placeholder'}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= What I learned ================= */}
      <section className="section section--sunken" aria-labelledby="learned-heading">
        <div className="container">
          <SectionHeader
            label="06 — What I Learned"
            title={<span id="learned-heading">Takeaways</span>}
            titleClass="display-m"
            body="Reserved for conclusions drawn from the build itself."
          />

          <Reveal stagger className="grid grid--3">
            {project.learned.map((item, index) => (
              <article
                className={`numbered-block${item.pending ? ' numbered-block--pending' : ''}`}
                key={item.title}
              >
                <span className="numbered-block__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="numbered-block__title">{item.title}</h3>
                {item.body ? (
                  <p className="numbered-block__body">{item.body}</p>
                ) : (
                  <div className="pending-space" aria-hidden="true" />
                )}
              </article>
            ))}
          </Reveal>

          <Reveal>
            <div className="cluster cluster--md" style={{ marginTop: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
              <Button to="/projects" variant="secondary" icon="arrow">
                Back to Projects
              </Button>
              <Button to="/contact" variant="ghost" icon="arrow">
                Ask Me About This Build
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand showResume={false} />
    </>
  )
}
