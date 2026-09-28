import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { navLinks } from '../data/portfolio'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you were looking for does not exist."
        noIndex
      />

      <section className="container page-top">
        <div className="notfound">
          <span className="notfound__code">Error 404 — Not found</span>
          <h1 className="display-l notfound__title">This page doesn&apos;t exist.</h1>
          <p className="lead" style={{ maxWidth: '48ch' }}>
            The link may be outdated, or the page may have moved. Here is everything that does
            exist.
          </p>

          <nav className="notfound__links" aria-label="All pages">
            {navLinks.map((link) => (
              <Link key={link.to} className="link-underline" to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <Link className="btn btn--primary" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
