import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { identity, navLinks, profileLinks, socialLinkKeys, socialMeta, hasProfileLink } from '../data/portfolio'
import { useScrolled } from '../hooks/useScrolled'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { SocialIcon } from './icons/SocialIcon'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const scrolled = useScrolled(8)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  useLockBodyScroll(open)

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Escape closes the drawer and returns focus to the toggle.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Move focus into the drawer when it opens so keyboard users land inside it.
  useEffect(() => {
    if (!open) return
    const firstLink = drawerRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <header className={`nav${scrolled || open ? ' nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label={`${identity.name} — home`}>
            <span className="nav__brand-name">{identity.name}</span>
            <span className="nav__brand-role" aria-hidden="true">
              / developer
            </span>
          </Link>

          <nav className="nav__desktop" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}

            {socialLinkKeys.some(hasProfileLink) ? (
              <div className="nav__social">
                {socialLinkKeys.filter(hasProfileLink).map((key) => (
                  <a
                    key={key}
                    className="nav__social-link"
                    href={profileLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialMeta[key].accessibleLabel}
                  >
                    <SocialIcon network={key} size={16} />
                  </a>
                ))}
              </div>
            ) : null}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        ref={drawerRef}
        className={`nav__drawer${open ? ' nav__drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="container nav__drawer-inner">
          <nav aria-label="Mobile">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `nav__drawer-link${isActive ? ' nav__drawer-link--active' : ''}`
                }
              >
                {link.label}
                <span className="nav__drawer-link-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="nav__drawer-section">
            <p className="label" style={{ marginBottom: '0.875rem' }}>
              Connect
            </p>
            <div className="cluster cluster--md" style={{ rowGap: '0.75rem' }}>
              {socialLinkKeys.filter(hasProfileLink).map((key) => (
                <a
                  key={key}
                  className="social-link"
                  href={profileLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialMeta[key].accessibleLabel}
                >
                  <SocialIcon network={key} className="social-link__icon" />
                  <span>{socialMeta[key].label}</span>
                </a>
              ))}
              <a className="social-link" href={profileLinks.email} aria-label={socialMeta.email.accessibleLabel}>
                <SocialIcon network="email" className="social-link__icon" />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="nav__drawer-footer">
            <a className="nav__drawer-email" href={profileLinks.email}>
              {identity.email}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
