/**
 * contact.ts — the only place the frontend talks to the backend.
 *
 * Contract (see backend/src/main/java/.../controller/ContactController.java):
 *   POST {API_BASE_URL}/contact
 *   200 { "success": true,  "message": "..." }
 *   400 { "success": false, "message": "...", "errors": { "field": "msg" } }
 *   429 { "success": false, "message": "..." }
 *   5xx { "success": false, "message": "..." }
 *
 * Errors are always converted into a typed result — the UI never sees a thrown
 * exception, and stack traces or internal details are never surfaced to users.
 */

import { API_BASE_URL, CONTACT_LIMITS, CONTACT_REQUEST_TIMEOUT_MS } from '../config/site'

export interface ContactPayload {
  name: string
  email: string
  message: string
  /** Honeypot field. Must stay empty; real users never see it. */
  website?: string
}

export type ContactField = 'name' | 'email' | 'message'

export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string; errors?: ContactErrors }

interface ApiResponseBody {
  success?: boolean
  message?: string
  errors?: Record<string, string>
}

const isField = (key: string): key is ContactField =>
  key === 'name' || key === 'email' || key === 'message'

/**
 * Server-side field errors are only trusted for known fields, and the message is
 * only shown when it is a plain string. Anything unexpected falls back to a
 * generic message so a malformed response can never inject arbitrary content.
 */
function normaliseErrors(raw: unknown): ContactErrors | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const entries = Object.entries(raw as Record<string, unknown>).filter(
    ([key, value]) => isField(key) && typeof value === 'string' && value.trim().length > 0,
  )
  if (entries.length === 0) return undefined
  return Object.fromEntries(entries) as ContactErrors
}

export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'
export const NETWORK_ERROR_MESSAGE =
  'Could not reach the server. Please check your connection and try again.'
export const RATE_LIMIT_MESSAGE = 'Too many messages sent. Please wait a few minutes and try again.'

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CONTACT_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        website: payload.website ?? '',
      }),
      signal: controller.signal,
    })

    let body: ApiResponseBody = {}
    try {
      body = (await response.json()) as ApiResponseBody
    } catch {
      body = {}
    }

    if (response.status === 429) {
      return { ok: false, message: RATE_LIMIT_MESSAGE }
    }

    if (response.status === 400) {
      const errors = normaliseErrors(body.errors)
      return {
        ok: false,
        message: typeof body.message === 'string' ? body.message : 'Please check the form and try again.',
        ...(errors ? { errors } : {}),
      }
    }

    if (!response.ok) {
      return { ok: false, message: GENERIC_ERROR_MESSAGE }
    }

    return {
      ok: true,
      message: typeof body.message === 'string' ? body.message : 'Message sent successfully.',
    }
  } catch {
    return { ok: false, message: NETWORK_ERROR_MESSAGE }
  } finally {
    window.clearTimeout(timeoutId)
  }
}

/* ========================================================================== */
/* Client-side validation — mirrors the server's Bean Validation rules so the */
/* user gets instant feedback. The server remains the source of truth.         */
/* ========================================================================== */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

export type ContactFormValues = {
  name: string
  email: string
  message: string
}

export function validateContactForm(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (name.length === 0) {
    errors.name = 'Name is required.'
  } else if (name.length < CONTACT_LIMITS.name.min) {
    errors.name = `Name must be at least ${CONTACT_LIMITS.name.min} characters.`
  } else if (name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Name must be ${CONTACT_LIMITS.name.max} characters or fewer.`
  }

  if (email.length === 0) {
    errors.email = 'Email is required.'
  } else if (email.length > CONTACT_LIMITS.email.max) {
    errors.email = 'Please enter a valid email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (message.length === 0) {
    errors.message = 'Message is required.'
  } else if (message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.message.min} characters.`
  } else if (message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Message must be ${CONTACT_LIMITS.message.max} characters or fewer.`
  }

  return errors
}
