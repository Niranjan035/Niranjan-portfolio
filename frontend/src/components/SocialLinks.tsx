import { Fragment } from 'react'
import {
  hasProfileLink,
  identity,
  profileLinks,
  socialLinkKeys,
  socialMeta,
  type ProfileLinkKey,
} from '../data/portfolio'
import { isDev } from '../config/site'
import { SocialIcon, ExternalArrow } from './icons/SocialIcon'

export interface SocialLinksProps {
  /** "stack" lays links out vertically, for the footer and contact sidebar. */
  variant?: 'inline' | 'stack'
  /** Include the email address as a mailto link. */
  includeEmail?: boolean
  /** Prepend a monospace label such as "Elsewhere". */
  label?: string
  className?: string
}

function NetworkLink({ network }: { network: ProfileLinkKey }) {
  const meta = socialMeta[network]
  return (
    <a
      className="social-link"
      href={profileLinks[network]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={meta.accessibleLabel}
    >
      <SocialIcon network={network} className="social-link__icon" />
      <span>{meta.label}</span>
      <ExternalArrow className="social-link__arrow" />
    </a>
  )
}

/**
 * SocialLinks — renders only links that actually have a URL configured.
 *
 * A link whose URL is still an empty string is never rendered as though it
 * were real, so the site cannot point visitors at a fabricated profile. In
 * development a clearly non-clickable reminder of what is still unconfigured is
 * shown; in production nothing is rendered for an unconfigured link.
 */
export function SocialLinks({
  variant = 'inline',
  includeEmail = false,
  label,
  className,
}: SocialLinksProps) {
  const configured = socialLinkKeys.filter(hasProfileLink)
  const missing = socialLinkKeys.filter((key) => !hasProfileLink(key))
  const showEmail = includeEmail && Boolean(identity.email)
  const hasVisibleLinks = configured.length > 0 || showEmail

  if (!hasVisibleLinks && !isDev) return null

  return (
    <div className={className}>
      {label ? (
        <span className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>
          {label}
        </span>
      ) : null}

      {hasVisibleLinks ? (
        <div className={`social-list${variant === 'stack' ? ' social-list--stack' : ''}`}>
          {configured.map((network) => (
            <Fragment key={network}>
              <NetworkLink network={network} />
            </Fragment>
          ))}
          {showEmail ? (
            <a
              className="social-link"
              href={profileLinks.email}
              aria-label={socialMeta.email.accessibleLabel}
            >
              <SocialIcon network="email" className="social-link__icon" />
              <span>{socialMeta.email.handle}</span>
            </a>
          ) : null}
        </div>
      ) : null}

      {isDev && missing.length > 0 ? (
        <p className="social-pending" style={{ marginTop: hasVisibleLinks ? '0.75rem' : 0 }}>
          <span aria-hidden="true">↳</span>
          <span>
            {missing.map((key) => socialMeta[key].label).join(', ')} URL
            {missing.length > 1 ? 's' : ''} not configured in src/data/portfolio.ts
          </span>
        </p>
      ) : null}
    </div>
  )
}
