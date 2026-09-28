import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { Timeline } from '../components/Timeline'
import { SocialLinks } from '../components/SocialLinks'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { about, education, identity, profileLinks } from '../data/portfolio'

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description={`About ${identity.name} — a ${identity.role} with an engineering background, focused on backend development, web applications, and problem solving.`}
        path="/about"
      />

      <PageIntro
        label="01 — About"
        title="About"
        titleId="about-title"
        lede={about.intro}
      />

      {/* ================= Identity ================= */}
      <section className="section" aria-labelledby="identity-heading">
        <div className="container">
          <div className="split">
            <Reveal>
              <div className="stack stack--5">
                <h2 id="identity-heading" className="display-m">
                  {identity.name}
                </h2>
                <p className="lead">{identity.role}</p>
                <p className="prose">
                  I work primarily on the backend — designing APIs, modelling data, and thinking
                  through what happens when a request fails. On the front end I care about the
                  things that are hard to fake: clear structure, honest empty states, and
                  interfaces that stay readable as they grow.
                </p>
                <p className="prose">
                  The stack is Java and Spring Boot on the server, Python and Django as a second
                  backend option, and React in the browser, with SQL and MySQL underneath. Each
                  piece is here because it earns its place in the project it is used on.
                </p>

                <div className="cluster cluster--md" style={{ paddingTop: 'var(--sp-2)' }}>
                  <Button to="/projects" variant="primary" icon="arrow">
                    View My Work
                  </Button>
                  <Button to="/contact" variant="secondary" icon="arrow">
                    Get In Touch
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="stack stack--5">
                <figure className="about-figure">
                  <img
                    src={about.image.src}
                    alt={about.image.alt}
                    width={about.image.width}
                    height={about.image.height}
                    decoding="async"
                  />
                </figure>

                <aside className="card" aria-label="Profile summary">
                  <dl className="kv">
                    <div className="kv__row">
                      <dt className="kv__key">Name</dt>
                      <dd className="kv__value">{identity.name}</dd>
                    </div>
                    <div className="kv__row">
                      <dt className="kv__key">Role</dt>
                      <dd className="kv__value">{identity.role}</dd>
                    </div>
                    {identity.location ? (
                      <div className="kv__row">
                        <dt className="kv__key">Based in</dt>
                        <dd className="kv__value">{identity.location}</dd>
                      </div>
                    ) : null}
                    <div className="kv__row">
                      <dt className="kv__key">Email</dt>
                      <dd className="kv__value">
                        <a className="link-accent" href={profileLinks.email}>
                          {identity.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <div className="card__footer">
                    <SocialLinks label="Connect" />
                  </div>
                </aside>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Journey ================= */}
      <section className="section section--sunken" aria-labelledby="journey-heading">
        <div className="container">
          <SectionHeader
            label="02 — Background"
            title={<span id="journey-heading">My Journey</span>}
            titleClass="display-m"
            body="How I moved from engineering into software, and what I have been building since."
          />

          <div className="split">
            <Reveal>
              <Timeline
                labelledBy="journey-heading"
                items={about.journey.map((entry) => ({
                  marker: entry.label,
                  title: entry.title,
                  body: entry.body,
                }))}
              />
            </Reveal>

            <Reveal delay={120}>
              <div className="split__aside stack stack--5">
                <div className="card">
                  <span className="label label-dot label--accent">Focus</span>
                  <ul className="chip-list" style={{ marginTop: 'var(--sp-4)' }}>
                    {about.focus.map((item) => (
                      <li key={item}>
                        <span className="chip chip--lg chip--accent">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <span className="label label-dot label--accent">Currently Learning</span>
                  <ul className="chip-list" style={{ marginTop: 'var(--sp-4)' }}>
                    {about.currentlyLearning.map((item) => (
                      <li key={item}>
                        <span className="chip chip--lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Education ================= */}
      <section className="section" aria-labelledby="education-heading">
        <div className="container container--narrow">
          <SectionHeader
            label="03 — Education"
            title={<span id="education-heading">Education</span>}
            titleClass="display-m"
            body="Mechanical engineering at Sir M Visvesvarayya College of Engineering, after a diploma at HKES Polytechnic."
          />

          <Reveal>
            <Timeline
              labelledBy="education-heading"
              items={education.map((entry) => ({
                marker: entry.year,
                title: entry.degree,
                meta: [entry.institution, entry.location],
                score: { label: entry.scoreLabel, value: entry.score },
              }))}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand label="Contact" />
    </>
  )
}
