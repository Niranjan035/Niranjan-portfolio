import { useId, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { CONTACT_LIMITS } from '../config/site'
import { identity } from '../data/portfolio'
import {
  sendContactMessage,
  validateContactForm,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
} from '../services/contact'
import { Button } from './Button'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: ContactFormValues = { name: '', email: '', message: '' }

export interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const formId = useId()
  const [values, setValues] = useState<ContactFormValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const honeypotRef = useRef<HTMLInputElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const statusRef = useRef<HTMLDivElement | null>(null)

  const statusId = `${formId}-status`
  const fieldId = (field: ContactField) => `${formId}-${field}`
  const errorId = (field: ContactField) => `${formId}-${field}-error`
  const submitting = status === 'submitting'

  function update(field: ContactField, value: string) {
    setValues((previous) => {
      const next = { ...previous, [field]: value }
      // Only re-validate a field the user has already interacted with, so the
      // form does not shout at someone who has not finished typing.
      if (touched[field]) {
        const nextErrors = validateContactForm(next)
        setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
      }
      return next
    })
  }

  function blur(field: ContactField) {
    setTouched((previous) => ({ ...previous, [field]: true }))
    setErrors(validateContactForm(values))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateContactForm(values)
    setTouched({ name: true, email: true, message: true })
    setErrors(nextErrors)

    const firstInvalid: ContactField | null =
      nextErrors.name ? 'name' : nextErrors.email ? 'email' : nextErrors.message ? 'message' : null

    if (firstInvalid) {
      setStatus('error')
      setStatusMessage('Please fix the highlighted fields and try again.')
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    setStatus('submitting')
    setStatusMessage('')

    const result = await sendContactMessage({
      ...values,
      website: honeypotRef.current?.value ?? '',
    })

    if (result.ok) {
      setStatus('success')
      setStatusMessage(result.message)
      setValues(EMPTY)
      setErrors({})
      setTouched({})
    } else {
      setStatus('error')
      setStatusMessage(result.message)
      if (result.errors) {
        setErrors((current) => ({ ...current, ...result.errors }))
      }
    }
  }

  const messageLength = values.message.trim().length
  const messageRemaining = CONTACT_LIMITS.message.max - messageLength

  return (
    <form className={`form ${className ?? ''}`.trim()} onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from users and assistive tech, tempting to bots. */}
      <div className="field--honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          ref={honeypotRef}
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form__grid form__grid--2">
        <div className={`field${errors.name ? ' field--invalid' : ''}`}>
          <label className="field__label" htmlFor={fieldId('name')}>
            Name
          </label>
          <input
            ref={nameRef}
            id={fieldId('name')}
            name="name"
            type="text"
            className="field__control"
            placeholder="Your name"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            disabled={submitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId('name') : undefined}
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            onBlur={() => blur('name')}
          />
          {errors.name ? (
            <p className="field__error" id={errorId('name')}>
              <AlertCircle size={13} strokeWidth={2} aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          ) : null}
        </div>

        <div className={`field${errors.email ? ' field--invalid' : ''}`}>
          <label className="field__label" htmlFor={fieldId('email')}>
            Email
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            className="field__control"
            placeholder="Your email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId('email') : undefined}
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            onBlur={() => blur('email')}
          />
          {errors.email ? (
            <p className="field__error" id={errorId('email')}>
              <AlertCircle size={13} strokeWidth={2} aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className={`field${errors.message ? ' field--invalid' : ''}`}>
        <label className="field__label" htmlFor={fieldId('message')}>
          Message
          <span className="field__optional">{CONTACT_LIMITS.message.min}+ characters</span>
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          className="field__control"
          placeholder="Write your message..."
          rows={7}
          required
          maxLength={CONTACT_LIMITS.message.max}
          disabled={submitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId('message') : `${formId}-message-count`}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          onBlur={() => blur('message')}
        />
        <div className="field__hint">
          <span>
            {errors.message ? (
              <span className="field__error" id={errorId('message')} style={{ marginTop: 0 }}>
                <AlertCircle size={13} strokeWidth={2} aria-hidden="true" />
                <span>{errors.message}</span>
              </span>
            ) : (
              'Sent directly to my inbox.'
            )}
          </span>
          <span
            id={`${formId}-message-count`}
            className={`field__counter${messageRemaining <= 200 ? ' field__counter--near-limit' : ''}`}
            aria-live="off"
          >
            {messageLength} / {CONTACT_LIMITS.message.max}
          </span>
        </div>
      </div>

      <div className="cluster" style={{ justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
        <Button type="submit" onClick={() => undefined} loading={submitting} icon="arrow" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
        <p className="mono text-tertiary" style={{ maxWidth: '26ch', textAlign: 'right' }}>
          {identity.responseTime
            ? identity.responseTime
            : 'Goes straight to my inbox.'}
        </p>
      </div>

      {/* Status region is a live region so screen readers announce the result. */}
      <div ref={statusRef} id={statusId} aria-live="polite" aria-atomic="true">
        {status === 'success' || status === 'error' ? (
          <p className={`form-status form-status--${status === 'success' ? 'success' : 'error'}`}>
            {status === 'success' ? (
              <CheckCircle2 size={15} strokeWidth={1.75} className="form-status__icon" aria-hidden="true" />
            ) : (
              <AlertCircle size={15} strokeWidth={1.75} className="form-status__icon" aria-hidden="true" />
            )}
            <span>{statusMessage}</span>
          </p>
        ) : null}
      </div>

      {/* Screen-reader-only context for the submit control. */}
      <p className="visually-hidden">
        This form sends a message to Niranjan Hiremath at niranjanhiremath11@gmail.com.
      </p>
    </form>
  )
}
