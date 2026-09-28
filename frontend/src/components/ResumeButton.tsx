import { FileText, Clock } from 'lucide-react'
import { resume } from '../data/portfolio'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

export interface ResumeButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** "download" for the primary action, "open" for the secondary. */
  action?: 'download' | 'open'
  className?: string
}

/**
 * ResumeButton — wired to /resume/Niranjan-Hiremath-Resume.pdf.
 *
 * `resume.available` is true and the PDF is published, so this renders a real
 * download link. If the PDF is ever withdrawn, set `resume.available` back to
 * false in src/data/portfolio.ts: the button degrades to an explicit disabled
 * "coming soon" state instead of linking to a 404.
 */
export function ResumeButton({ variant = 'secondary', size = 'md', action = 'download', className }: ResumeButtonProps) {
  const label = action === 'download' ? 'Download Resume' : 'Open Full Resume'
  const icon = action === 'download' ? 'download' : 'external'

  if (resume.available) {
    return (
      <Button
        href={resume.path}
        download={action === 'download'}
        variant={variant}
        size={size}
        icon={icon}
        className={className}
        aria-label={`${label} (PDF)`}
      >
        {label}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => undefined}
      disabled
      variant={variant}
      size={size}
      className={className}
      aria-label={`${label} — ${resume.unavailableMessage}`}
    >
      {action === 'download' ? (
        <>
          <span className="btn__icon">
            <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span>{label}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <span className="btn__icon">
            <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
          </span>
        </>
      )}
    </Button>
  )
}

/** The explicit "no file yet" note. Hidden once the PDF is published. */
export function ResumeUnavailableNotice() {
  if (resume.available) return null
  return (
    <p className="notice notice--pending">
      <Clock size={15} strokeWidth={1.75} className="notice__icon" aria-hidden="true" />
      <span>
        <strong>{resume.unavailableMessage}</strong> The final PDF has not been published yet. The
        button becomes active as soon as{' '}
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>{resume.path}</code>{' '}
        is added.
      </span>
    </p>
  )
}
