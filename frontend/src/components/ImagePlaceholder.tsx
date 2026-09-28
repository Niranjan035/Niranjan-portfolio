import type { ReactNode } from 'react'
import { ImageOff, Camera } from 'lucide-react'

export type PlaceholderSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ImagePlaceholderProps {
  /** Monospace label, e.g. "SHOONYA — HERO IMAGE". */
  label: string
  /** Short explanation of what image belongs here. */
  note?: ReactNode
  size?: PlaceholderSize
  dark?: boolean
  /** Real image path. When set, the photograph renders instead of the grid. */
  src?: string | null
  alt?: string
  /** Optional caption bar. Pass undefined to omit the bar entirely. */
  caption?: string
  /** Right-hand mono text inside the caption bar. */
  captionMeta?: string
  /** Hide the caption bar even if a caption is supplied. */
  bare?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
}

/**
 * ImagePlaceholder — an intentional, premium stand-in for an image that has not
 * been uploaded yet.
 *
 * It reads clearly as a placeholder (grid + corner marks + label) rather than
 * pretending to be a real asset, and never falls back to a stock or
 * AI-generated photograph. Pass `src` to swap in the real image with no other
 * changes — the frame, ratio and caption stay identical.
 */
export function ImagePlaceholder({
  label,
  note,
  size = 'md',
  dark = false,
  src,
  alt = '',
  caption,
  captionMeta,
  bare = false,
  loading = 'lazy',
  className,
}: ImagePlaceholderProps) {
  const hasImage = Boolean(src)
  const showCaption = !bare && Boolean(caption || captionMeta)

  const classes = [
    'placeholder',
    `placeholder--${size}`,
    dark ? 'placeholder--dark' : '',
    hasImage ? 'placeholder--filled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role={hasImage ? undefined : 'img'} aria-label={hasImage ? undefined : `${label} — placeholder`}>
      {hasImage ? (
        <div className="placeholder__media">
          <img src={src as string} alt={alt} loading={loading} decoding="async" />
        </div>
      ) : (
        <>
          <span className="placeholder__corner placeholder__corner--tl" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--tr" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--bl" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--br" aria-hidden="true" />
          <div className="placeholder__content">
            <Camera size={22} strokeWidth={1.25} className="placeholder__icon" aria-hidden="true" />
            <span className="placeholder__label">{label}</span>
            {note ? <p className="placeholder__note">{note}</p> : null}
          </div>
        </>
      )}

      {showCaption ? (
        <div className="placeholder__caption">
          <span>{caption}</span>
          <span className="cluster cluster--sm">
            {hasImage ? null : (
              <span className="cluster cluster--sm" style={{ gap: '0.25rem' }}>
                <ImageOff size={11} strokeWidth={1.75} aria-hidden="true" /> Placeholder
              </span>
            )}
            {captionMeta ? <span>{captionMeta}</span> : null}
          </span>
        </div>
      ) : null}
    </div>
  )
}
