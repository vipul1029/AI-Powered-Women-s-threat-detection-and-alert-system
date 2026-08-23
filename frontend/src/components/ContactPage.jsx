import { useState } from 'react'
import {
  Mail, Github, MapPin, Clock, Send, CheckCircle,
  ChevronDown, ChevronUp,
} from 'lucide-react'

const CONTACT_CARDS = [
  { icon: Mail,   label: 'Email',         value: 'team@safeguard.example.com', sub: 'We reply within 24 hours',             color: 'violet'  },
  { icon: Github, label: 'GitHub',        value: 'github.com/safeguard-ai',    sub: 'Open source contributions welcome',    color: 'cyan'    },
  { icon: MapPin, label: 'Location',      value: 'India',                      sub: 'Final Year B.Tech Project',            color: 'purple'  },
  { icon: Clock,  label: 'Response Time', value: '< 24 hours',                 sub: 'Mon – Sat, 9 AM – 6 PM IST',          color: 'emerald' },
]

const ACCENT = {
  violet:  'text-violet-400 bg-violet-500/10 border-violet-500/20',
  cyan:    'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',
  purple:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

const FAQ = [
  { q: 'Is SafeAura free to use?',           a: 'Yes — SafeAura is a free academic research project. The source code is open for educational and non-commercial use.' },
  { q: 'What cameras does it support?',       a: 'Webcams (via browser MediaDevices API), RTSP IP cameras, uploaded video files (.mp4, .avi, .mov), and folder-based batch processing.' },
  { q: 'Does it work without a GPU?',         a: 'Yes. SafeAura automatically falls back to CPU inference. A GPU gives 30+ FPS; CPU typically gives 5–12 FPS depending on hardware.' },
  { q: 'Is footage sent to any cloud server?',a: 'No. All inference runs locally on your machine. Frames are processed in-memory and are never uploaded or stored externally.' },
]

const inputCls = `w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5
                  text-[13px] text-gray-100 placeholder-gray-600 focus:outline-none
                  focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                  transition-all duration-200`

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-gray-400">
        {label}{required && <span className="text-violet-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [open, setOpen]   = useState(null)

  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-92px)] text-gray-100">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-900 py-14">
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[420px]
                        rounded-full bg-violet-700/10 blur-[110px]" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-[320px] w-[320px]
                        rounded-full bg-cyan-600/[0.07] blur-[90px]" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-violet-500/10 border border-violet-500/20 text-[10px]
                          font-bold tracking-[0.15em] uppercase text-violet-400 mb-6">
            <Mail className="h-3 w-3" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-[-0.03em] mb-4 leading-[1.08]">
            <span className="text-gray-100">Get in </span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400
                             bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Questions about deployment, collaboration, or the project — reach out and
            we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-dark-900">
        <div className="max-w-5xl mx-auto px-6 space-y-14">

          {/* Two-column: form + cards */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">

            {/* Form */}
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-7">
              <h3 className="text-gray-100 font-black text-[16px] mb-1">Send a Message</h3>
              <p className="text-gray-500 text-[12px] mb-6">
                Questions, collaboration requests, or anything else — we'd love to hear from you.
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20
                                  flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-gray-100 font-bold text-[15px] mb-1">Message sent!</div>
                    <div className="text-gray-500 text-[12px]">
                      Thanks {form.name.split(' ')[0]}. We'll get back to you within 24 hours.
                    </div>
                  </div>
                  <button
                    onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSent(false) }}
                    className="mt-2 text-[11px] font-bold text-violet-400 hover:text-violet-300
                               transition-colors underline underline-offset-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input type="text" value={form.name} onChange={set('name')}
                        placeholder="Your name" className={inputCls} required />
                    </Field>
                    <Field label="Email Address" required>
                      <input type="email" value={form.email} onChange={set('email')}
                        placeholder="you@example.com" className={inputCls} required />
                    </Field>
                  </div>
                  <Field label="Subject">
                    <select value={form.subject} onChange={set('subject')} className={inputCls}>
                      <option value="">Select a topic…</option>
                      <option>General Enquiry</option>
                      <option>Deployment Help</option>
                      <option>Research Collaboration</option>
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="Message" required>
                    <textarea value={form.message} onChange={set('message')}
                      placeholder="Tell us what's on your mind…"
                      rows={5} className={`${inputCls} resize-none`} required />
                  </Field>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                               font-bold text-[13px] text-white
                               bg-gradient-to-r from-violet-600 to-blue-600
                               shadow-[0_0_20px_rgba(139,92,246,0.35)]
                               hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]
                               hover:scale-[1.01] transition-all duration-200">
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div className="flex flex-col gap-3">
              {CONTACT_CARDS.map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label}
                  className="flex items-start gap-4 bg-dark-800 border border-dark-600
                             rounded-xl p-4 hover:border-violet-500/20 transition-colors">
                  <div className={`h-9 w-9 shrink-0 rounded-lg border flex items-center
                                   justify-center ${ACCENT[color]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500 mb-0.5">{label}</div>
                    <div className="text-gray-100 text-[12.5px] font-bold">{value}</div>
                    <div className="text-gray-600 text-[10.5px] mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-gray-100 font-black text-[16px] mb-5">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {FAQ.map(({ q, a }, i) => (
                <div key={i}
                  className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden
                             hover:border-violet-500/20 transition-colors">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className="text-gray-100 font-bold text-[13px]">{q}</span>
                    {open === i
                      ? <ChevronUp   className="h-4 w-4 text-violet-400 shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-gray-500  shrink-0" />}
                  </button>
                  {open === i && (
                    <div className="px-5 pb-4 text-gray-500 text-[12.5px] leading-relaxed
                                    border-t border-dark-600 pt-3">
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <div className="bg-dark-900 border-t border-dark-600 py-5">
        <p className="text-center text-gray-600 text-[11px]">
          © 2025–26 SafeAura Team · Women's Threat Detection &amp; Alert System · Final Year Project
        </p>
      </div>
    </div>
  )
}
