import { Seo } from '../components/Seo'
import { PageIntro } from '../components/PageIntro'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { ContactForm } from '../components/ContactForm'
import { SocialLinks } from '../components/SocialLinks'
import { hasProfileLink, identity, profileLinks, socialLinkKeys } from '../data/portfolio'
import { SocialIcon } from '../components/icons/SocialIcon'

export default function ContactPage() {
  const configured = socialLinkKeys.filter(hasProfileLink)

  return (
    <>
      <Seo
        title="Get In Touch"
        description={`Contact ${identity.name} at ${identity.email}. Open to opportunities, collaborations, and interesting projects.`}
        path="/contact"
      />

      <PageIntro
        label="06 — Contact"
        title="Get In Touch"
        titleId="contact-title"
        lede="Open to opportunities, collaborations, and interesting projects."
      />

      <section className="section" aria-labelledby="form-heading">
        <div className="container">
          <div className="split">
            {/* ---------------- Form ---------------- */}
            <Reveal>
              <div className="stack stack--5">
                <SectionHeader
                  label="01 — Message"
                  title={<span id="form-heading">Send a message</span>}
                  titleClass="display-m"
                  body="The form delivers your message straight to my inbox. No third-party form service is involved."
                />
                <ContactForm />
              </div>
            </Reveal>

            {/* ---------------- Direct contact ---------------- */}
            <Reveal delay={120}>
              <aside className="split__aside stack stack--5">
                <div className="card">
                  <span className="label label-dot label--accent">Email</span>
                  <p className="mono" style={{ marginTop: 'var(--sp-4)', wordBreak: 'break-word' }}>
                    <a className="link-accent" href={profileLinks.email}>
                      {identity.email}
                    </a>
                  </p>
                  <p className="card__body" style={{ marginTop: 'var(--sp-3)' }}>
                    Prefer to write directly? This address reaches the same inbox.
                  </p>
                </div>

                <div className="card">
                  <span className="label label-dot label--accent">Profile links</span>
                  {configured.length > 0 ? (
                    <div style={{ marginTop: 'var(--sp-4)' }}>
                      <SocialLinks variant="stack" />
                    </div>
                  ) : (
                    <p className="card__body" style={{ marginTop: 'var(--sp-4)' }}>
                      LinkedIn, GitHub, and LeetCode links have not been published yet. They will
                      appear here once configured.
                    </p>
                  )}
                </div>

                <div className="card card--sunken">
                  <span className="label">Details</span>
                  <dl className="kv" style={{ marginTop: 'var(--sp-4)' }}>
                    {identity.location ? (
                      <div className="kv__row">
                        <dt className="kv__key">Based in</dt>
                        <dd className="kv__value">{identity.location}</dd>
                      </div>
                    ) : null}
                    <div className="kv__row">
                      <dt className="kv__key">Availability</dt>
                      <dd className="kv__value">
                        {identity.availableForWork ? 'Open to opportunities' : 'Not available'}
                      </dd>
                    </div>
                    {identity.responseTime ? (
                      <div className="kv__row">
                        <dt className="kv__key">Response time</dt>
                        <dd className="kv__value">{identity.responseTime}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <SocialLinks label="Elsewhere" includeEmail variant="stack" />
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- What to expect ---------------- */}
      <section className="section section--sunken" aria-labelledby="expect-heading">
        <div className="container">
          <SectionHeader
            label="02 — Process"
            title={<span id="expect-heading">What happens next</span>}
            titleClass="display-m"
          />

          <Reveal stagger className="grid grid--3">
            {[
              {
                step: '01',
                title: 'Message arrives',
                body: 'Your message is validated, delivered to my inbox by the application backend, and stored for reference.',
              },
              {
                step: '02',
                title: 'I read it',
                body: 'I read every message that comes through this form and reply personally, with more detail on what you asked about.',
              },
              {
                step: '03',
                title: 'We talk specifics',
                body: 'Scope, stack, timeline. If it is a mutual fit, the work starts from something concrete.',
              },
            ].map((block) => (
              <article className="numbered-block" key={block.step}>
                <span className="numbered-block__index">{block.step}</span>
                <h3 className="numbered-block__title">{block.title}</h3>
                <p className="numbered-block__body">{block.body}</p>
              </article>
            ))}
          </Reveal>

          <Reveal>
            <p className="notice" style={{ marginTop: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
              <SocialIcon network="email" size={15} className="notice__icon" />
              <span>
                The contact form is served by a Spring Boot backend that sends mail through{' '}
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>
                  JavaMailSender
                </code>{' '}
                and records submissions in MySQL.
              </span>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
