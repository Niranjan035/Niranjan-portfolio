import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, DEFAULT_DESCRIPTION, isDev } from '../config/site'
import { profileLinks, socialLinkKeys } from '../data/portfolio'

interface SeoProps {
  /** Page title. Rendered as "<title> | Niranjan Hiremath" unless `titleOnly`. */
  title: string
  description?: string
  /** Route path, e.g. "/projects". Used for the canonical URL. */
  path?: string
  /** og:type — "article" reads better for project pages. */
  type?: 'website' | 'article'
  noIndex?: boolean
  /** Set on the homepage so the title is not duplicated with the site name. */
  titleOnly?: boolean
}

const BRAND = 'Niranjan Hiremath'

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/**
 * Seo — updates document metadata for the current route.
 *
 * Implemented directly against the DOM rather than pulling in a helmet
 * dependency: the requirement is small, and this keeps the bundle lean.
 *
 * No social preview image is declared because none exists. Add a real
 * 1200x630 asset to index.html when one is created.
 */
export function Seo({ title, description, path, type = 'website', noIndex = false, titleOnly = false }: SeoProps) {
  const { pathname } = useLocation()

  const fullTitle = titleOnly || title === BRAND ? title : `${title} | ${BRAND}`
  const metaDescription = description ?? DEFAULT_DESCRIPTION
  const routePath = path ?? pathname
  const canonical = SITE_URL ? `${SITE_URL}${routePath === '/' ? '' : routePath}` : routePath

  useEffect(() => {
    document.title = fullTitle

    setMeta('meta[name="description"]', 'name', 'description', metaDescription)
    setCanonical(canonical)

    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', metaDescription)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription)
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
  }, [fullTitle, metaDescription, canonical, type, noIndex])

  // Structured data: a minimal Person graph built only from known facts.
  // `sameAs` lists only the profile URLs actually configured in portfolio.ts -
  // an empty or removed URL is dropped rather than published as a dead link.
  useEffect(() => {
    if (isDev && routePath !== '/') return

    const sameAs: string[] = socialLinkKeys
      .map((key) => String(profileLinks[key]))
      .filter((url) => url.startsWith('http') && url.trim().length > 0)

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    const person: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: BRAND,
      jobTitle: 'Software Developer & Full-Stack Developer',
      email: profileLinks.email || undefined,
      url: SITE_URL || undefined,
      sameAs,
    }
    script.textContent = JSON.stringify(person)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [routePath])

  return null
}
