import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, ArrowUpRight, Download } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonIcon = 'arrow' | 'down' | 'external' | 'download' | null

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ButtonIcon
  /** Icon rendered before the label instead of after it. */
  iconLeading?: boolean
  className?: string
  children: ReactNode
  'aria-label'?: string
}

type InternalLinkProps = CommonProps & {
  to: string
  href?: never
  onClick?: never
  type?: never
  disabled?: never
}

type ExternalLinkProps = CommonProps & {
  href: string
  to?: never
  onClick?: never
  type?: never
  download?: boolean
  target?: '_blank'
  rel?: string
  disabled?: never
}

type ActionButtonProps = CommonProps & {
  onClick: () => void
  to?: never
  href?: never
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

export type ButtonProps = InternalLinkProps | ExternalLinkProps | ActionButtonProps

function iconFor(icon: ButtonIcon) {
  switch (icon) {
    case 'arrow':
      return <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
    case 'down':
      return <ArrowDown size={15} strokeWidth={1.75} aria-hidden="true" />
    case 'external':
      return <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
    case 'download':
      return <Download size={15} strokeWidth={1.75} aria-hidden="true" />
    default:
      return null
  }
}

function classNames(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  const sizeClass = size === 'md' ? '' : `btn--${size}`
  return ['btn', `btn--${variant}`, sizeClass, extra].filter(Boolean).join(' ')
}

function children({ icon, iconLeading, children }: Pick<CommonProps, 'icon' | 'iconLeading' | 'children'>) {
  const glyph = iconFor(icon ?? null)
  if (!glyph) return children
  return (
    <>
      {iconLeading ? <span className="btn__icon">{glyph}</span> : null}
      <span>{children}</span>
      {!iconLeading ? <span className="btn__icon">{glyph}</span> : null}
    </>
  )
}

/**
 * Button — one component for every call to action.
 *
 * Pass `to` for internal routes (client-side navigation),
 * `href` for external/downloadable files (opens safely in a new tab),
 * or `onClick` for in-page actions.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconLeading, className, children: label } = props
  const classes = classNames(variant, size, className)
  const content = children({ icon, iconLeading, children: label })

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} aria-label={props['aria-label']}>
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, download, target, rel } = props
    return (
      <a
        href={href}
        className={classes}
        // Download links stay in the same tab; external links open a new one.
        {...(download ? { download: '' } : { target: target ?? '_blank', rel: rel ?? 'noopener noreferrer' })}
        aria-label={props['aria-label']}
      >
        {content}
      </a>
    )
  }

  const { onClick, type = 'button', disabled, loading } = props as ActionButtonProps
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={props['aria-label']}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>{label}</span>
        </>
      ) : (
        content
      )}
    </button>
  )
}

/* Re-exported so call sites can extend button styling without a wrapper div. */
export type { ButtonHTMLAttributes, AnchorHTMLAttributes }
