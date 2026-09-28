import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { ResumeButton, ResumeUnavailableNotice } from '../components/ResumeButton'
import { Timeline } from '../components/Timeline'
import { SocialLinks } from '../components/SocialLinks'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import {
  achievements,
  education,
  identity,
  profileLinks,
  projects,
  resume,
  skillCategories,
} from '../data/portfolio'

export default function ResumePage() {
  return (
    <>
      <Seo
        title="Resume"
        description={`${identity.name}'s resume — education, skills, projects, and achievements. ${resume.available ? 'Download the PDF.' : resume.unavailableMessage}`}
        path="/resume"
      />

      <PageIntro
        label="07 — Resume"
        title="Resume"
        titleId="resume-title"
        lede={resume.summary}
      />

      <section className="section" aria-labelledby="download-heading">
        <div className="container">
          <div className="split">
            <Reveal>
              <div className="stack stack--5">
                <span className="label label-dot label--accent">Download</span>
                <h2 id="download-heading" className="display-m">
                  {resume.available ? 'Take a copy' : 'Not published yet'}
                </h2>
                <p className="prose">
                  A single-page PDF covering education, technical skills, the Shoonya build, and
                  academic achievements. The file is served from{' '}
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>
                    {resume.path}
                  </code>
                  .
                </p>

                <div className="btn-group">
                  <ResumeButton variant="primary" size="lg" action="download" />
                  <ResumeButton variant="secondary" size="lg" action="open" />
                </div>

                <ResumeUnavailableNotice />

                <p className="prose">
                  In the meantime the full details are all on this site:{' '}
                  <a className="link-accent" href={profileLinks.email}>
                    email me
                  </a>{' '}
                  and I will send a copy directly.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card">
                <span className="label">At a glance</span>
                <dl className="kv" style={{ marginTop: 'var(--sp-4)' }}>
                  <div className="kv__row">
                    <dt className="kv__key">Education</dt>
                    <dd className="kv__value">B.E. Mechanical, 2026</dd>
                  </div>
                  <div className="kv__row">
                    <dt className="kv__key">CGPA</dt>
                    <dd className="kv__value">8.64</dd>
                  </div>
                  <div className="kv__row">
                    <dt className="kv__key">Primary stack</dt>
                    <dd className="kv__value">Java · Spring Boot</dd>
                  </div>
                  <div className="kv__row">
                    <dt className="kv__key">Projects</dt>
                    <dd className="kv__value">{projects.map((project) => project.title).join(', ')}</dd>
                  </div>
                  <div className="kv__row">
                    <dt className="kv__key">Achievements</dt>
                    <dd className="kv__value">{achievements.length} listed</dd>
                  </div>
                </dl>
                <div className="card__footer">
                  <SocialLinks label="Connect" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Full detail on the page ================= */}
      <section className="section section--sunken" aria-labelledby="detail-heading">
        <div className="container">
          <SectionHeader
            label="01 — Full Detail"
            title={<span id="detail-heading">Everything on one page</span>}
            titleClass="display-m"
            body="So the resume content is readable even before the PDF exists."
          />

          <div className="grid grid--2">
            <Reveal>
              <article className="card" style={{ height: '100%' }}>
                <span className="label label--accent">Education</span>
                <div style={{ marginTop: 'var(--sp-5)' }}>
                  <Timeline
                    items={education.map((entry) => ({
                      marker: entry.year,
                      title: entry.degree,
                      meta: [entry.institution],
                      score: { label: entry.scoreLabel, value: entry.score },
                    }))}
                  />
                </div>
              </article>
            </Reveal>

            <Reveal delay={80}>
              <article className="card" style={{ height: '100%' }}>
                <span className="label label--accent">Achievements</span>
                <ul className="stack stack--3" style={{ marginTop: 'var(--sp-5)' }}>
                  {achievements.map((achievement) => (
                    <li key={achievement.title} className="kv__row">
                      <span className="kv__key">{achievement.title}</span>
                      <span className="kv__value">{achievement.scope}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>

          <Reveal>
            <article className="card" style={{ marginTop: 'var(--grid-gap)' }}>
              <span className="label label--accent">Skills</span>
              <div className="grid grid--3" style={{ marginTop: 'var(--sp-5)', gap: 'var(--sp-5)' }}>
                {skillCategories.map((category) => (
                  <div key={category.id}>
                    <h3 className="numbered-block__title" style={{ marginBottom: '0.5rem' }}>
                      {category.title}
                    </h3>
                    <ul className="chip-list">
                      {category.items.map((item) => (
                        <li key={item}>
                          <span className="chip">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal>
            <div className="cluster cluster--md" style={{ marginTop: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
              <Button to="/experience" variant="secondary" icon="arrow">
                Education &amp; Achievements
              </Button>
              <Button to="/projects/shoonya" variant="ghost" icon="arrow">
                Shoonya Case Study
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand showResume={false} />
    </>
  )
}
