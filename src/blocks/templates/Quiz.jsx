import { useState } from 'react'
import { HubspotForm } from '../primitives.jsx'
import Button from '../../components/Button.jsx'

// §3.34 Quiz (/assessments/climate-disclosure): 763x640 card, intro + 6 question slides + final form slide.
// Measured: card size/position, slide padding 40 gap 24, option rows 25 tall gap 15, form 520 wide.
// Page band, intro title (48/52.8 400 -1.44 cobalt), toolbar and progress (256x12, #c1d2fe / #5d93ff) measured live.
// Question-slide internals are not rendered until interaction on the live page and stay unmeasured.
const QUESTIONS = [
  { q: 'Does your company do business in the state?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
  { q: 'What was your total annual revenue last fiscal year?', type: 'radio', options: ['Under $500M', '$500M to $1B', 'Over $1B'] },
  { q: 'Is your company organised in the United States?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
  { q: 'Which emissions do you currently measure?', type: 'checkbox', options: ['Scope 1', 'Scope 2', 'Scope 3', 'None yet'] },
  { q: 'Do you currently obtain third-party assurance?', type: 'radio', options: ['Yes, limited', 'Yes, reasonable', 'No'] },
  { q: 'Which frameworks do you already report to?', type: 'checkbox', options: ['Voluntary questionnaire', 'Climate risk framework', 'EU standards', 'None'] },
]
const TOTAL = QUESTIONS.length
const QUIZ_FIELDS = [
  { name: 'first', label: 'First name', half: true },
  { name: 'last', label: 'Last name', half: true },
  { name: 'company', label: 'Company name' },
  { name: 'email', label: 'Company email', type: 'email' },
  { name: 'phone', label: 'Phone number', type: 'tel' },
]

export default function Quiz() {
  const [step, setStep] = useState(0) // 0 intro, 1..6 questions, 7 form
  const [answers, setAnswers] = useState({})
  const q = QUESTIONS[step - 1]
  const toggle = (opt) =>
    setAnswers((a) => {
      const cur = a[step] ?? []
      if (q.type === 'radio') return { ...a, [step]: [opt] }
      return { ...a, [step]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] }
    })
  const done = Math.min(step, TOTAL)

  return (
    // Measured 1440 (live): band bg linear-gradient(#fffbf3, #93aeff), padding 152 0 140 from under the translucent nav
    // (84 below an opaque one); an 821 container with the 765x642 card at its right (x 338): bg rgba(255,255,255,.9),
    // 1px cobalt border; inner white 763x640 = 560 slide area (padding 40, gap 24) + 80 toolbar (padding 18 40, gap 16).
    <section className="relative overflow-hidden px-4 pb-[140px] pt-12 md:pt-[84px]" style={{ background: 'linear-gradient(#fffbf3, #93aeff)' }}>
      <div className="mx-auto max-w-[821px] md:pl-14">
        <div className="border border-cobalt bg-white/90">
          <div className="flex flex-col bg-white md:min-h-[640px]">
            {/* MOTION: keen-slider transition between slides */}
            <div className="flex flex-col gap-6 p-6 md:h-[560px] md:p-10">
              {step === 0 && (
                <div className="flex flex-col">
                  <p className="font-mono text-sm leading-5 tracking-[normal] text-[#415591]">State disclosure checker</p>
                  <h1 className="text-[32px] font-normal leading-[36px] tracking-[-0.96px] text-cobalt md:text-[48px] md:leading-[52.8px] md:tracking-[-1.44px]">Find out whether new state emissions reporting rules apply to your company</h1>
                  <hr className="mt-8 h-px border-0" style={{ background: 'linear-gradient(to right, #658dfd, transparent)' }} />
                  <p className="t-lead mt-8 max-w-[480px]">New state rules require large companies doing business in the state to report greenhouse gas emissions. In this short check you will see whether the rules are likely to apply and what to prepare for a first filing. This is a screening tool, not legal advice.</p>
                </div>
              )}
              {q && (
                <fieldset className="flex flex-col gap-6">
                  <legend className="mb-6 font-mono text-sm leading-5 tracking-[normal] text-[#415591]">
                    Question {step} of {TOTAL}
                  </legend>
                  <p className="text-[24px] font-medium leading-[28px] tracking-[-0.72px] text-ink md:text-[28px] md:leading-[32.2px] md:tracking-[-0.84px]">{q.q}</p>
                  <div className="flex flex-col gap-[15px]">
                    {q.options.map((opt) => {
                      const checked = (answers[step] ?? []).includes(opt)
                      return (
                        <label key={opt} className="flex min-h-[25px] cursor-pointer items-center gap-3 text-lg text-ink">
                          <input type={q.type} name={`q${step}`} checked={checked} onChange={() => toggle(opt)} className="h-4 w-4 accent-cobalt" />
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}
              {step === TOTAL + 1 && (
                <div className="flex flex-col gap-6">
                  <p className="text-[24px] font-medium leading-[28px] tracking-[-0.72px] text-ink-secondary md:text-[28px] md:leading-[32.2px] md:tracking-[-0.84px]">Ready to see your results?</p>
                  <div className="mx-auto w-full max-w-[520px]">
                    <HubspotForm fields={QUIZ_FIELDS} submitLabel="Get results" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-[18px] md:px-10">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-sm leading-5 tracking-[normal] text-[#415591]">
                  {done} / {TOTAL}
                </span>
                <span className="block h-3 w-[200px] bg-cobalt-20 md:w-64">
                  <span className="block h-full bg-[#5d93ff]" style={{ width: `${(done / TOTAL) * 100}%` }} />
                </span>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="h-11 rounded-btn bg-cobalt-10 px-4 text-md font-medium leading-6 text-[#0033cc]">
                  Previous
                </button>
                {step <= TOTAL && (
                  <Button as="button" type="button" onClick={() => setStep((s) => s + 1)} disabled={q && !(answers[step] ?? []).length} arrow className="h-11 disabled:!bg-[#c8d0e0]">
                    {step === 0 ? 'Get started' : 'Next'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
