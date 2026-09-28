import { Link } from 'react-router-dom'
import {
  hasProfileLink,
  identity,
  navLinks,
  profileLinks,
  socialLinkKeys,
  socialMeta,
} from '../data/portfolio'
import { SocialIcon, ExternalArrow } from './icons/SocialIcon'

const COPYRIGHT_YEAR = 2026

export function Footer() {
  return (
    <footer className="footer theme-dark">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__name">{identity.name}</p>
            <p className="footer__role">{identity.role}</p>
            <p
              className="footer__role"
              style={{ maxWidth: '32ch', lineHeight: 1.7, letterSpacing: 0 }}
            >
              Building practical software — backend systems, clean interfaces, and
              problems worth solving.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="footer__heading">Navigate</h2>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link className="footer__link" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer__heading">Elsewhere</h2>
            <ul className="footer__links">
              {socialLinkKeys.filter(hasProfileLink).map((key) => (
                <li key={key}>
                  <a
                    className="footer__link"
                    href={profileLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialMeta[key].accessibleLabel}
                  >
                    <SocialIcon network={key} size={14} />
                    <span>{socialMeta[key].label}</span>
                    <ExternalArrow className="social-link__arrow" size={12} />
                  </a>
                </li>
              ))}
              <li>
                <a className="footer__link" href={profileLinks.email} aria-label={socialMeta.email.accessibleLabel}>
                  <SocialIcon network="email" size={14} />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Get in touch</h2>
            <a className="footer__email" href={profileLinks.email}>
              {identity.email}
            </a>
            {identity.location ? (
              <p className="footer__role" style={{ marginTop: '0.875rem', color: 'var(--dark-ink-secondary)' }}>
                {identity.location}
              </p>
            ) : null}
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            <span>
              © {COPYRIGHT_YEAR} {identity.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>Built with React &amp; Spring Boot</span>
          </div>
          <Link className="footer__built" to="/contact">
            Let&apos;s work together
            <ExternalArrow size={12} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
