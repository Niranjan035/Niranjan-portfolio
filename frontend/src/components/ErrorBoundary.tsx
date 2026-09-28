import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * ErrorBoundary — last line of defence so a render error shows a usable page
 * instead of a blank screen. No stack traces or internal details are rendered.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Logged locally for the developer only; never shown to the visitor.
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="container">
        <div className="notfound">
          <span className="notfound__code">Error — Something broke</span>
          <h1 className="display-l notfound__title">This page failed to load.</h1>
          <p className="lead" style={{ maxWidth: '46ch' }}>
            An unexpected error occurred while rendering. Reloading the page usually resolves it.
          </p>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a className="btn btn--secondary" href="/">
              Back to home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
