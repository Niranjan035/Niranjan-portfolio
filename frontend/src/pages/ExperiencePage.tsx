import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { Timeline } from '../components/Timeline'
import { AchievementCard } from '../components/AchievementCard'
import { CtaBand } from '../components/CtaBand'
import { achievements, education, identity, leadership } from '../data/portfolio'

export default function ExperiencePage() {
  return (
    <>
      <Seo
        title="Education & Achievements"
        description={`Education and academic achievements of ${identity.name} — B.E. Mechanical Engineering at SMVCE Raichur, HKES Polytechnic diploma, and academic awards.`}
        path="/experience"
      />

      <PageIntro
        label="04 — Experience"
        title="Education & Achievements"
        titleId="experience-title"
        lede="Where I studied, what I scored, and what I was recognised for."
        aside={
          <div className="fact-strip" style={{ maxWidth: '38rem' }}>
            <div className="fact">
              <span className="fact__label">B.E. CGPA</span>
              <span className="fact__value">8.64</span>
              <span className="fact__note">Mechanical Engineering, 2026</span>
            </div>
            <div className="fact">
              <span className="fact__label">Diploma GPA</span>
              <span className="fact__value">8.6</span>
              <span className="fact__note">Polytechnic, 2023</span>
            </div>
            <div className="fact">
              <span className="fact__label">VTU Karnataka</span>
              <span className="fact__value">Top 90</span>
              <span className="fact__note">University rank</span>
            </div>
          </div>
        }
      />

      {/* ================= Education ================= */}
      <section className="section" aria-labelledby="education-heading">
        <div className="container">
          <div className="split">
            <Reveal>
              <SectionHeader
                label="01 — Education"
                title={<span id="education-heading">Where I studied</span>}
                titleClass="display-m"
              />
            </Reveal>

            <Reveal delay={80}>
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
        </div>
      </section>

      {/* ================= Achievements ================= */}
      <section className="section section--sunken" aria-labelledby="achievements-heading">
        <div className="container">
          <SectionHeader
            label="02 — Achievements"
            title={<span id="achievements-heading">Recognition</span>}
            titleClass="display-m"
            body="Academic awards and entrance examination results. The DCET result is a Karnataka state rank."
          />

          <Reveal stagger className="grid grid--4">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.title} achievement={achievement} index={index} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= Leadership ================= */}
      <section className="section" aria-labelledby="leadership-heading">
        <div className="container container--narrow">
          <SectionHeader
            label="03 — Leadership"
            title={<span id="leadership-heading">Leadership</span>}
            titleClass="display-m"
          />

          <div className="stack stack--4">
            {leadership.map((item) => (
              <Reveal key={`${item.title}-${item.organisation}`}>
                <article className="card card--tick">
                  <div className="card__header">
                    <div className="stack stack--1">
                      <h3 className="card__title">{item.title}</h3>
                      <span className="label label--accent">{item.organisation}</span>
                    </div>
                    <span className="label">College</span>
                  </div>

                  {item.pending ? (
                    <>
                      <p className="card__body text-tertiary">
                        Responsibilities will be added here. The role is listed without a
                        description rather than with an invented one.
                      </p>
                      <div className="pending-space" style={{ marginTop: 'var(--sp-4)' }} aria-hidden="true" />
                    </>
                  ) : (
                    <p className="card__body">{item.details}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="notice" style={{ marginTop: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
              <span className="notice__icon" aria-hidden="true">
                ℹ
              </span>
              <span>
                <strong>On work experience:</strong> this portfolio does not list employment
                history, because there is none to list yet. I would rather show an honest
                education and project record than fill the page with placeholder roles.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
