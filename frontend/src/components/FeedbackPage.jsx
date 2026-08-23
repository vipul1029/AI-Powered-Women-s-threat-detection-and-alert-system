import { useState } from 'react'
import {
  MessageSquare, Star, Send, CheckCircle, ThumbsUp,
  Bug, Lightbulb, Layers, Zap, Eye,
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 'bug',      icon: Bug,           label: 'Bug Report',      color: 'red'     },
  { id: 'feature',  icon: Lightbulb,     label: 'Feature Request', color: 'amber'   },
  { id: 'ui',       icon: Layers,        label: 'UI / Design',     color: 'violet'  },
  { id: 'perf',     icon: Zap,           label: 'Performance',     color: 'cyan'    },
  { id: 'accuracy', icon: Eye,           label: 'AI Accuracy',     color: 'blue'    },
  { id: 'general',  icon: MessageSquare, label: 'General',         color: 'emerald' },
]

const CAT_ACCENT = {
  red:     'border-red-500/40     bg-red-500/10     text-red-400',
  amber:   'border-amber-500/40   bg-amber-500/10   text-amber-400',
  violet:  'border-violet-500/40  bg-violet-500/10  text-violet-400',
  cyan:    'border-cyan-500/40    bg-cyan-500/10    text-cyan-400',
  blue:    'border-blue-500/40    bg-blue-500/10    text-blue-400',
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
}

const FEATURES_VOTE = [
  { id: 'sms',     label: 'SMS / Email alert relay to family contacts' },
  { id: 'mobile',  label: 'Mobile app for remote monitoring'           },
  { id: 'night',   label: 'Night-vision & IR camera support'           },
  { id: 'multi',   label: 'Multi-camera grid view'                     },
  { id: 'heatmap', label: 'Threat heatmap & analytics dashboard'       },
  { id: 'export',  label: 'Alert export to PDF / CSV report'           },
]

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

const inputCls = `w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5
                  text-[13px] text-gray-100 placeholder-gray-600 focus:outline-none
                  focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                  transition-all duration-200`

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function FeedbackPage() {
  const [rating,    setRating]    = useState(0)
  const [hovered,   setHovered]   = useState(0)
  const [category,  setCategory]  = useState('')
  const [text,      setText]      = useState('')
  const [name,      setName]      = useState('')
  const [votes,     setVotes]     = useState({})
  const [submitted, setSubmitted] = useState(false)

  const toggleVote = id => setVotes(v => ({ ...v, [id]: !v[id] }))
  const canSubmit  = rating > 0 && category && text.trim()

  const submit = e => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
  }

  /* ── Success screen ─────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-92px)] bg-dark-900 flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center gap-5 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500
                          flex items-center justify-center
                          shadow-[0_0_28px_rgba(139,92,246,0.45)]">
            <ThumbsUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-gray-100 font-black text-xl mb-2">
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}!
            </div>
            <div className="text-gray-500 text-[13px] leading-relaxed">
              Your feedback helps us make SafeAura better. We read every submission carefully.
            </div>
          </div>
          <button
            onClick={() => {
              setRating(0); setCategory(''); setText(''); setName('')
              setVotes({}); setSubmitted(false)
            }}
            className="px-6 py-2.5 rounded-xl font-bold text-[12px]
                       bg-violet-500/10 border border-violet-500/25 text-violet-400
                       hover:bg-violet-500/20 transition-all duration-200"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    )
  }

  /* ── Main page ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-92px)] text-gray-100">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-900 py-10">
        <div className="pointer-events-none absolute -top-32 right-1/3 h-[400px] w-[400px]
                        rounded-full bg-violet-700/10 blur-[110px]" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[300px] w-[300px]
                        rounded-full bg-cyan-600/[0.07] blur-[90px]" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-violet-500/10 border border-violet-500/20 text-[10px]
                          font-bold tracking-[0.15em] uppercase text-violet-400 mb-4">
            <MessageSquare className="h-3 w-3" />
            Share Your Feedback
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3 leading-[1.1]">
            <span className="text-gray-100">Help us </span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400
                             bg-clip-text text-transparent">improve SafeAura</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
            Rate the system, report issues, suggest features, and vote on what we should build next.
          </p>
        </div>
      </section>

      {/* ── Two-column form ─────────────────────────────────────────────── */}
      <section className="py-10 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <form onSubmit={submit}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

              {/* ── LEFT COLUMN: Rating + Feedback text ─────────────────── */}
              <div className="flex flex-col gap-5">

                {/* Star rating */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-gray-100 font-black text-[15px] mb-1">
                        Overall Experience
                        <span className="text-violet-400 ml-1">*</span>
                      </div>
                      <div className="text-gray-500 text-[12px]">
                        How would you rate SafeAura overall?
                      </div>
                    </div>
                    {(hovered || rating) > 0 && (
                      <span className="shrink-0 text-[11px] font-black text-amber-400
                                       bg-amber-500/10 border border-amber-500/25
                                       px-3 py-1 rounded-full">
                        {RATING_LABELS[hovered || rating]}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl
                                   border transition-all duration-150 group
                                   border-dark-600 bg-dark-700 hover:border-amber-500/30
                                   hover:bg-amber-500/[0.05]"
                        style={n <= (hovered || rating)
                          ? { borderColor: 'rgba(245,158,11,0.40)', background: 'rgba(245,158,11,0.06)' }
                          : {}}
                      >
                        <Star className={`h-7 w-7 transition-colors duration-150
                                          ${n <= (hovered || rating)
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-600 group-hover:text-amber-500/60'}`} />
                        <span className={`text-[10px] font-bold transition-colors
                                          ${n <= (hovered || rating)
                                            ? 'text-amber-400'
                                            : 'text-gray-600'}`}>
                          {n}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback textarea */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 flex-1">
                  <label className="block text-[11px] font-bold tracking-[0.08em]
                                    uppercase text-gray-400 mb-2">
                    Your Feedback <span className="text-violet-400">*</span>
                  </label>
                  <p className="text-gray-600 text-[11px] mb-3">
                    Describe your experience — what works well, what could be improved,
                    or any specific issue you noticed.
                  </p>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Write your feedback here…"
                    rows={8}
                    className={`${inputCls} resize-none`}
                    required
                  />
                </div>
              </div>

              {/* ── RIGHT COLUMN: Name + Category + Wishlist + Submit ────── */}
              <div className="flex flex-col gap-5">

                {/* Name */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
                  <label className="block text-[11px] font-bold tracking-[0.08em]
                                    uppercase text-gray-400 mb-2">
                    Your Name
                    <span className="ml-2 text-gray-600 font-normal normal-case
                                     tracking-normal text-[10px]">(optional)</span>
                  </label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="How should we address you?"
                    className={inputCls}
                  />
                </div>

                {/* Category */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
                  <div className="text-[11px] font-bold tracking-[0.08em] uppercase
                                  text-gray-400 mb-1">
                    Category <span className="text-violet-400">*</span>
                  </div>
                  <div className="text-gray-600 text-[11px] mb-3">Select the type of feedback</div>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(({ id, icon: Icon, label, color }) => (
                      <button key={id} type="button"
                        onClick={() => setCategory(id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border
                                    text-[11.5px] font-bold transition-all duration-200
                                    ${category === id
                                      ? CAT_ACCENT[color]
                                      : 'border-dark-600 bg-dark-700 text-gray-500 hover:border-dark-500 hover:text-gray-300'}`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature wishlist */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
                  <div className="text-[11px] font-bold tracking-[0.08em] uppercase
                                  text-gray-400 mb-1">
                    Feature Wishlist
                  </div>
                  <div className="text-gray-600 text-[11px] mb-3">
                    What should we build next? (Select any)
                  </div>
                  <div className="space-y-1.5">
                    {FEATURES_VOTE.map(({ id, label }) => (
                      <button key={id} type="button"
                        onClick={() => toggleVote(id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                                    border text-left transition-all duration-200
                                    ${votes[id]
                                      ? 'border-violet-500/40 bg-violet-500/[0.06] text-gray-100'
                                      : 'border-dark-600 bg-dark-700 text-gray-500 hover:border-dark-500 hover:text-gray-300'}`}
                      >
                        <div className={`h-4 w-4 rounded shrink-0 border flex items-center
                                         justify-center transition-colors duration-200
                                         ${votes[id]
                                           ? 'bg-violet-500 border-violet-500'
                                           : 'border-dark-500'}`}>
                          {votes[id] && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-[11.5px] font-medium leading-snug">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             font-bold text-[13px] text-white
                             bg-gradient-to-r from-violet-600 to-blue-600
                             shadow-[0_0_20px_rgba(139,92,246,0.35)]
                             hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]
                             hover:scale-[1.01] transition-all duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed
                             disabled:hover:scale-100
                             disabled:hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Feedback
                </button>

              </div>
            </div>
          </form>
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
