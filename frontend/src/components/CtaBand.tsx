import { Reveal } from './Reveal'
import { Button } from './Button'
import { ResumeUnavailableNotice } from './ResumeButton'

export interface CtaBandProps {
  label?: string
  title?: string
  body?: string
  /** Set false to omit the resume button. */
  showResume?: boolean
}

/** The dark call-to-action band, used at the bottom of the main content pages. */
export function CtaBand({
  label = 'Contact',
  title = 'Have a project or opportunity?',
  body = "Let's connect and build something useful.",
  showResume = true,
}: CtaBandProps) {
  return (
    <section className="cta theme-dark" aria-labelledby="cta-heading">
      <div className="container cta__inner">
        <Reveal>
          <span className="label label-dot label--accent">{label}</span>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="cta-heading" className="display-l cta__title">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="cta__body">{body}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <Button to="/contact" variant="primary" size="lg" icon="arrow">
              Get In Touch
            </Button>
            {showResume ? (
              <Button to="/resume" variant="secondary" size="lg" icon="down">
                Download Resume
              </Button>
            ) : null}
          </div>
        </Reveal>
        {showResume ? <ResumeUnavailableNotice /> : null}
      </div>
    </section>
  )
}
