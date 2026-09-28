import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { Button } from '../components/Button'
import { HeroBlueprint } from '../components/HeroBlueprint'
import { SocialLinks } from '../components/SocialLinks'
import { ResumeButton } from '../components/ResumeButton'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { CtaBand } from '../components/CtaBand'
import { about, featuredProject, heroTechLine, identity, skillCategories } from '../data/portfolio'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Niranjan Hiremath | Software Developer & Full-Stack Developer"
        description="Portfolio of Niranjan Hiremath, a Software Developer and Full-Stack Developer."
        path="/"
        titleOnly
      />

      {/* ================= Hero ================= */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container hero__grid">
          <div className="hero__content">
            <Reveal>
              <span className="label label-dot label--accent">{identity.heroLabel}</span>
            </Reveal>

            <Reveal delay={60}>
              <h1 id="hero-heading" className="display-xl hero__title">
                <span className="hero__title-line">Software Developer</span>
                <span className="hero__title-line hero__title-line--muted"> &amp; Full-Stack Developer</span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="lead hero__lede">{identity.tagline}</p>
            </Reveal>

            <Reveal delay={180}>
              <div className="hero__actions">
                <Button to="/projects" variant="primary" size="lg" icon="arrow">
                  View My Work
                </Button>
                <ResumeButton variant="secondary" size="lg" />
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="hero__tech">
                <span className="hero__tech-label">Stack</span>
                {heroTechLine.map((tech, index) => (
                  <span key={tech} className="cluster cluster--sm" style={{ gap: '0.4375rem' }}>
                    {index > 0 ? (
                      <span className="hero__tech-sep" aria-hidden="true">
                        ·
                      </span>
                    ) : null}
                    <span className="mono text-secondary">{tech}</span>
                  </span>
                ))}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="hero__social">
                <span className="hero__social-label">Elsewhere</span>
                <SocialLinks />
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="hero__visual">
            <HeroBlueprint />
            <p className="hero__visual-caption">
              <span>Fig. 01 — System architecture</span>
              <span>SVG / CSS</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= Featured project ================= */}
      <section className="section section--sunken" aria-labelledby="featured-heading">
        <div className="container">
          <SectionHeader
            label="01 — Featured Project"
            title={
              <span id="featured-heading">
                {featuredProject.title}
                <span className="heading-accent"> — {featuredProject.type}</span>
              </span>
            }
            titleClass="display-l"
            split
            actions={
              <Button to="/projects" variant="ghost" icon="arrow">
                All Projects
              </Button>
            }
          />

          <Reveal>
            <div className="grid grid--2" style={{ alignItems: 'center' }}>
              <div className="stack stack--5">
                <p className="lead">{featuredProject.summary}</p>

                <div className="kv">
                  {featuredProject.keyFacts.map((fact) => (
                    <div className="kv__row" key={fact.label}>
                      <span className="kv__key">{fact.label}</span>
                      <span className="kv__value">{fact.value}</span>
                    </div>
                  ))}
                </div>

                <ul className="chip-list" aria-label="Key components">
                  {featuredProject.tags.map((tag) => (
                    <li key={tag}>
                      <span className="chip chip--accent">{tag}</span>
                    </li>
                  ))}
                </ul>

                <div className="cluster cluster--md">
                  <Button to={`/projects/${featuredProject.slug}`} variant="primary" icon="arrow">
                    View Project
                  </Button>
                  <span className="mono text-tertiary">Case study</span>
                </div>
              </div>

              <Link
                to={`/projects/${featuredProject.slug}`}
                aria-label={`View the ${featuredProject.title} case study`}
                style={{ display: 'block' }}
              >
                <ImagePlaceholder
                  label={`${featuredProject.title} — ${featuredProject.type}`}
                  note="Project photograph to be added. The frame keeps the same proportions once a real image is supplied."
                  src={featuredProject.image.src}
                  alt={featuredProject.image.alt}
                  size="lg"
                  caption="Hero image"
                  captionMeta={featuredProject.image.src ? undefined : 'Placeholder'}
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Skills preview ================= */}
      <section className="section" aria-labelledby="skills-preview-heading">
        <div className="container">
          <SectionHeader
            label="02 — Skills"
            title={<span id="skills-preview-heading">Tools I Build With</span>}
            titleClass="display-l"
            split
            actions={
              <Button to="/skills" variant="ghost" icon="arrow">
                All Skills
              </Button>
            }
          />

          <Reveal stagger>
            <div className="skills-preview">
              {skillCategories.map((category) => (
                <div className="skills-preview__cell" key={category.id}>
                  <h3 className="skills-preview__title">{category.title}</h3>
                  <ul className="skills-preview__list">
                    {category.items.map((item) => (
                      <li className="skills-preview__item" key={item}>
                        <span className="skills-preview__bullet" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= About preview ================= */}
      <section className="section section--sunken" aria-labelledby="about-preview-heading">
        <div className="container">
          <div className="split split--equal">
            <div className="stack stack--6">
              <SectionHeader
                label="03 — About"
                title={<span id="about-preview-heading">{about.homeHeading}</span>}
                titleClass="display-m"
              />
              <Reveal>
                <div className="stack stack--4">
                  <p className="prose">{about.homeBody}</p>
                  <div>
                    <Button to="/about" variant="secondary" icon="arrow">
                      More About Me
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <AboutVisual />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Local visuals — use the shared ImagePlaceholder so swapping in real photos  */
/* is a one-prop change in src/data/portfolio.ts.                             */
/* -------------------------------------------------------------------------- */

function AboutVisual() {
  return (
    <ImagePlaceholder
      label="Personal photograph"
      note="A real photograph will be placed here. No stock or generated portrait is used in the meantime."
      size="md"
      caption="Portrait"
      captionMeta="Placeholder"
    />
  )
}
