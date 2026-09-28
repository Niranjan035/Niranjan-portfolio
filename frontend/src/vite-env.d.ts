/// <reference types="vite/client" />

/**
 * Public build-time configuration.
 *
 * Every value here is inlined into the client bundle and is therefore visible
 * to anyone. Never add a secret.
 *
 * CORS is deliberately absent: allowed origins are a backend concern, configured
 * with CORS_ALLOWED_ORIGINS. The contact email is deliberately absent too — it
 * lives in src/data/portfolio.ts with the rest of the site content.
 */
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_DEFAULT_TITLE?: string
  readonly VITE_DEFAULT_DESCRIPTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
