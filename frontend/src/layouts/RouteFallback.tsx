/** Minimal, quiet placeholder shown while a lazy route chunk loads. */
export function RouteFallback() {
  return (
    <div className="page" role="status" aria-live="polite">
      <div className="container" style={{ paddingBlock: 'clamp(6rem, 5rem + 6vw, 11rem)' }}>
        <span className="label label-dot label--accent">Loading</span>
        <span className="visually-hidden">Loading page content.</span>
      </div>
    </div>
  )
}
