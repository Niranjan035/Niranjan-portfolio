/**
 * site.ts
 * ---------------------------------------------------------------------------
 * Environment-driven configuration. Everything here has a safe fallback so the
 * app renders in development without a .env file. No secrets live on the
 * frontend — only public values. See src/vite-env.d.ts for the env contract.
 */

const env: ImportMetaEnv = import.meta.env

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '')

/** Base URL of the Spring Boot REST API, e.g. "http://localhost:8080/api". */
export const API_BASE_URL: string = trimTrailingSlash(
  env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api',
)

/** Canonical site origin without a trailing slash, e.g. "https://example.com". */
export const SITE_URL: string = trimTrailingSlash(
  env.VITE_SITE_URL?.trim() ||
    (typeof window !== 'undefined' ? window.location.origin : ''),
)

export const DEFAULT_TITLE: string =
  env.VITE_DEFAULT_TITLE?.trim() ||
  'Niranjan Hiremath | Software Developer & Full-Stack Developer'

export const DEFAULT_DESCRIPTION: string =
  env.VITE_DEFAULT_DESCRIPTION?.trim() ||
  'Portfolio of Niranjan Hiremath, a Software Developer and Full-Stack Developer.'

/** Development-only request timeout for the contact form. */
export const CONTACT_REQUEST_TIMEOUT_MS = 15_000

/** Client-side field limits. Mirrored by Bean Validation on the server. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const

export const isDev: boolean = Boolean(env.DEV)
