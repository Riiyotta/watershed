import './primitives.css'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { SelectTriangles } from './icons.jsx'
import { href } from '../routing.js'

// §1.5 HubSpot-style form primitive.
//
// Field config: { name, label, type?: 'text'|'email'|'tel'|'select', options?: [{value,label}] | [string],
//                 half?: true (two consecutive half fields share a 2-col row, gap 12), required? }

export function Field({ label, type = 'text', name, tall = false, required = true, className = '', defaultValue = '', ...rest }) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  return (
    <div className={`hs-field ${tall ? 'is-tall' : ''} ${value ? 'is-floated' : ''} ${className}`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        className="hs-control"
        autoComplete="off"
        {...rest}
      />
      <label htmlFor={id} className="hs-label">
        {label}
        {required ? '*' : ''}
      </label>
    </div>
  )
}

// Select with floating label. `float` keeps the label floated (e.g. filters whose empty option reads "All").
// Controlled when `value`/`onChange` are passed.
export function SelectField({ label, name, options = [], required = true, float = false, value, onChange, placeholderOption = true, className = '' }) {
  const id = useId()
  const [inner, setInner] = useState('')
  const v = value ?? inner
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <div className={`hs-field ${float || v ? 'is-floated' : ''} ${className}`}>
      <select
        id={id}
        name={name}
        value={v}
        required={required}
        onChange={(e) => (onChange ? onChange(e.target.value) : setInner(e.target.value))}
        className="hs-control is-select"
        style={!float && !v ? { color: 'transparent' } : undefined}
      >
        {placeholderOption && <option value="" />}
        {opts.map((o) => (
          <option key={o.value} value={o.value} style={{ color: '#242633' }}>
            {o.label}
          </option>
        ))}
      </select>
      <label htmlFor={id} className="hs-label">
        {label}
        {required ? '*' : ''}
      </label>
      <SelectTriangles className="hs-chevrons" />
    </div>
  )
}

export function LegalCopy({ className = '', tone = 'default', verb = 'submitting this form' }) {
  return (
    <p className={`text-xs font-medium leading-[18px] tracking-[-0.12px] ${tone === 'muted' ? 'text-ink-secondary' : tone === 'navy' ? 'text-[#415591]' : 'text-ink'} ${className}`}>
      By {verb} you agree to Northwind&apos;s{' '}
      <Link to={href('/legal/privacy')} className="text-cobalt">
        privacy policy
      </Link>
      , and consent to receive Northwind marketing communications.
    </p>
  )
}

// Group consecutive `half` fields into 2-col rows.
function rows(fields) {
  const out = []
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if (f.half && fields[i + 1]?.half) {
      out.push([f, fields[i + 1]])
      i++
    } else out.push([f])
  }
  return out
}

function renderField(field) {
  const f = { ...field }
  delete f.half
  if (f.type === 'select') return <SelectField key={f.name} {...f} />
  return <Field key={f.name} {...f} />
}

export default function HubspotForm({ fields, submitLabel = 'Submit', legal = true, legalVerb, legalTone, className = '', onSubmit }) {
  const [sent, setSent] = useState(false)
  return (
    <form
      className={`hubspot-fallback-form grid gap-[14px] ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
        onSubmit?.(e)
      }}
    >
      {rows(fields).map((r, i) =>
        r.length === 2 ? (
          <div key={i} className="hubspot-field-columns grid grid-cols-1 gap-3 sm:grid-cols-2">
            {r.map(renderField)}
          </div>
        ) : (
          renderField(r[0])
        ),
      )}
      {legal && <LegalCopy verb={legalVerb} tone={legalTone} />}
      <div>
        <button type="submit" className="hs-submit-btn">
          {submitLabel}
        </button>
      </div>
      {/* Post-submit state was not measured (§8); a neutral notice is shown. */}
      {sent && (
        <p role="status" className="text-sm font-medium text-cobalt">
          Thanks, this is a placeholder form and nothing was sent.
        </p>
      )}
    </form>
  )
}

// Email catcher (§1.5): [field 1fr][button], gap 16 0, legal spans both columns.
export function EmailCatcher({ buttonLabel = 'Sign up', label = 'Email', className = '', legal = true }) {
  return (
    <form className={`hs-catcher grid grid-cols-1 gap-y-[5px] md:grid-cols-[1fr_auto] md:gap-y-4 ${className}`} onSubmit={(e) => e.preventDefault()}>
      <Field name="email" type="email" label={label} tall />
      <button type="submit" className="hs-submit-btn">
        {buttonLabel}
      </button>
      {legal && <LegalCopy className="md:col-span-2 max-md:text-[10px] max-md:leading-[15px] max-md:tracking-[-0.1px]" tone="navy" />}
    </form>
  )
}

// Common field sets (§1.5 "Typical field sets"). Options are generic placeholders.
const COUNTRIES = ['United Kingdom', 'United States', 'Germany', 'France', 'Australia', 'Canada', 'Other']
const HEARD = ['Search engine', 'Social media', 'Event', 'Colleague or friend', 'Podcast', 'Other']
const HELP = ['Measurement', 'Reporting and disclosure', 'Reduction planning', 'Supplier engagement', 'Something else']

export const FIELDSETS = {
  demo: [
    { name: 'first', label: 'First name', half: true },
    { name: 'last', label: 'Last name', half: true },
    { name: 'phone', label: 'Phone number', type: 'tel' },
    { name: 'country', label: 'Country', type: 'select', options: COUNTRIES },
    { name: 'company', label: 'Company name' },
    { name: 'email', label: 'Company email', type: 'email' },
    { name: 'help', label: 'How can Northwind help you most?', type: 'select', options: HELP },
    { name: 'heard', label: 'How did you hear about us?' },
  ],
  guide: [
    { name: 'first', label: 'First name', half: true },
    { name: 'last', label: 'Last name', half: true },
    { name: 'company', label: 'Company name' },
    { name: 'phone', label: 'Phone number', type: 'tel' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'heard', label: 'How did you hear about Northwind?', type: 'select', options: HEARD },
  ],
  event: [
    { name: 'first', label: 'First name', half: true },
    { name: 'last', label: 'Last name', half: true },
    { name: 'title', label: 'Job title', half: true },
    { name: 'company', label: 'Company name', half: true },
    { name: 'email', label: 'Company email', type: 'email' },
    { name: 'help', label: 'How can Northwind help you most?', type: 'select', options: HELP },
  ],
  tour: [
    { name: 'first', label: 'First name', half: true },
    { name: 'last', label: 'Last name', half: true },
    { name: 'company', label: 'Company name' },
    { name: 'email', label: 'Company email', type: 'email' },
    { name: 'heard', label: 'How did you hear about us?' },
  ],
  waitlist: [
    { name: 'first', label: 'First name', half: true, required: false },
    { name: 'last', label: 'Last name', half: true },
    { name: 'email', label: 'Company email', type: 'email' },
  ],
}
