import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { SkillCard } from '../components/SkillCard'
import { CtaBand } from '../components/CtaBand'
import { identity, skillCategories, type SkillCategoryId } from '../data/portfolio'

type FilterId = 'all' | SkillCategoryId

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'languages', label: 'Languages' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'database', label: 'Database' },
  { id: 'core', label: 'CS' },
  { id: 'tools', label: 'Tools' },
]

export default function SkillsPage() {
  const [active, setActive] = useState<FilterId>('all')

  const visible = useMemo(
    () => (active === 'all' ? skillCategories : skillCategories.filter((c) => c.id === active)),
    [active],
  )

  const totalItems = useMemo(
    () => skillCategories.reduce((sum, category) => sum + category.items.length, 0),
    [],
  )

  return (
    <>
      <Seo
        title="Skills & Technologies"
        description={`The technologies ${identity.name} builds with: Java, Spring Boot, Python, Django, React, SQL, MySQL, and computer science fundamentals.`}
        path="/skills"
      />

      <PageIntro
        label="03 — Skills"
        title="Skills & Technologies"
        titleId="skills-title"
        lede="Technologies and tools I use to build, understand, and ship software."
        aside={
          <div className="fact-strip" style={{ maxWidth: '34rem' }}>
            <div className="fact">
              <span className="fact__label">Categories</span>
              <span className="fact__value">{String(skillCategories.length).padStart(2, '0')}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Technologies</span>
              <span className="fact__value">{String(totalItems).padStart(2, '0')}</span>
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="skills-list-heading">
        <div className="container">
          <SectionHeader
            label="01 — Inventory"
            title={<span id="skills-list-heading">What I work with</span>}
            titleClass="display-m"
            body="Listed without proficiency scores — levels are not stated where they cannot be demonstrated."
          />

          {/* Filters are single-select, so a radiogroup is the accurate pattern. */}
          <div
            className="filter-bar"
            role="radiogroup"
            aria-label="Filter skills by category"
            id="skill-filters"
          >
            {FILTERS.map((filter) => {
              const count =
                filter.id === 'all'
                  ? skillCategories.length
                  : skillCategories.filter((c) => c.id === filter.id).length
              const isActive = active === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`filter-btn${isActive ? ' filter-btn--active' : ''}`}
                  onClick={() => setActive(filter.id)}
                >
                  {filter.label}
                  <span className="filter-btn__count" aria-hidden="true">
                    {String(count).padStart(2, '0')}
                  </span>
                  <span className="visually-hidden">{` — ${count} ${count === 1 ? 'category' : 'categories'}`}</span>
                </button>
              )
            })}
          </div>

          {/* Remounting on filter change replays the reveal transition. */}
          <div key={active} className="grid grid--3">
            {visible.map((category) => (
              <SkillCard key={category.id} category={category} count={category.items.length} />
            ))}
          </div>

          <p className="visually-hidden" role="status" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'category' : 'categories'}.
          </p>
        </div>
      </section>

      {/* ================= How these fit together ================= */}
      <section className="section section--sunken" aria-labelledby="stack-heading">
        <div className="container">
          <SectionHeader
            label="02 — In Practice"
            title={<span id="stack-heading">How they fit together</span>}
            titleClass="display-m"
            body="The stack is not a list — it is a path a request takes through the system."
          />

          <Reveal stagger className="grid grid--3">
            {[
              {
                step: '01',
                title: 'Request arrives',
                body: 'React renders the interface and issues a fetch. A REST API in Spring Boot or Django receives it.',
                stack: ['React', 'REST APIs', 'Spring Boot'],
              },
              {
                step: '02',
                title: 'Business logic',
                body: 'Java or Python services apply the rules. Java handles the core domain with OOP and typed data.',
                stack: ['Java', 'Python', 'Django'],
              },
              {
                step: '03',
                title: 'Data is persisted',
                body: 'SQL against MySQL, with schema design that reflects the domain rather than the query.',
                stack: ['SQL', 'MySQL', 'DBMS'],
              },
            ].map((block) => (
              <article className="numbered-block" key={block.step}>
                <span className="numbered-block__index">{block.step}</span>
                <h3 className="numbered-block__title">{block.title}</h3>
                <p className="numbered-block__body">{block.body}</p>
                <ul className="chip-list" style={{ marginTop: 'var(--sp-2)' }}>
                  {block.stack.map((tech) => (
                    <li key={tech}>
                      <span className="chip">{tech}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand showResume={false} />
    </>
  )
}
