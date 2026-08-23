import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCheck, AlertTriangle, Zap, Clock, Radio } from 'lucide-react'

const SEV = {
  LOW: {
    bar:        'bg-yellow-500',
    border:     'border-yellow-500/30',
    glow:       '',
    badge:      'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
    conf:       'bg-yellow-500',
    icon:       <AlertTriangle className="w-3.5 h-3.5" />,
    thumbActive:'border-yellow-400',
    label:      'text-yellow-300',
  },
  MEDIUM: {
    bar:        'bg-orange-500',
    border:     'border-orange-500/30',
    glow:       '',
    badge:      'bg-orange-500/15 border-orange-500/40 text-orange-300',
    conf:       'bg-orange-500',
    icon:       <AlertTriangle className="w-3.5 h-3.5" />,
    thumbActive:'border-orange-400',
    label:      'text-orange-300',
  },
  HIGH: {
    bar:        'bg-red-500',
    border:     'border-red-500/35',
    glow:       'shadow-[0_0_16px_rgba(239,68,68,0.18)]',
    badge:      'bg-red-500/15 border-red-500/45 text-red-300',
    conf:       'bg-red-500',
    icon:       <Zap className="w-3.5 h-3.5" />,
    thumbActive:'border-red-400',
    label:      'text-red-300',
  },
  CRITICAL: {
    bar:        'bg-gradient-to-r from-red-600 to-rose-500',
    border:     'border-rose-500/50',
    glow:       'shadow-[0_0_24px_rgba(244,63,94,0.30)]',
    badge:      'bg-rose-500/20 border-rose-500/55 text-rose-300',
    conf:       'bg-gradient-to-r from-red-500 to-rose-500',
    icon:       <Zap className="w-3.5 h-3.5" />,
    thumbActive:'border-rose-400',
    label:      'text-rose-300',
  },
}

function fmtTime(iso) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

function fmtTimeShort(iso) {
  try { return new Date(iso).toLocaleTimeString() } catch { return iso }
}

export default function AlertCard({ alert, onResolve }) {
  const [snap, setSnap] = useState(0)
  const s = SEV[alert.severity] || SEV.MEDIUM
  const snapshots = alert.snapshots || []
  const confPct = Math.round((alert.confidence ?? 0) * 100)

  const prev = () => setSnap(n => Math.max(0, n - 1))
  const next = () => setSnap(n => Math.min(snapshots.length - 1, n + 1))

  return (
    <div className={`rounded-2xl border bg-dark-800 overflow-hidden transition-all duration-200
                     ${s.border} ${s.glow}
                     ${alert.resolved ? 'opacity-55' : 'hover:bg-dark-700'}`}>

      {/* Top severity bar */}
      <div className={`h-[3px] w-full ${s.bar}`} />

      <div className="p-4 space-y-3.5">

        {/* ── Header row ──────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            {/* Badge + class name */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                border text-[11px] font-black uppercase tracking-wider ${s.badge}`}>
                {s.icon}
                {alert.severity}
              </span>
              <span className="text-gray-100 font-bold text-[13px] capitalize">
                {alert.threat_class?.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
              <Clock className="w-3 h-3 shrink-0" />
              {fmtTime(alert.timestamp)}
            </div>
          </div>

          {/* Confidence ring/number */}
          <div className="shrink-0 flex flex-col items-center gap-0.5">
            <div className={`text-[22px] font-black leading-none ${s.label}`}>
              {confPct}%
            </div>
            <div className="text-[9px] text-gray-600 font-bold tracking-[0.08em] uppercase">
              confidence
            </div>
          </div>
        </div>

        {/* ── Confidence bar ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-600 font-bold tracking-[0.06em] uppercase">
              Detection Confidence
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-dark-600 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${s.conf}`}
              style={{ width: `${confPct}%` }}
            />
          </div>
        </div>

        {/* ── Source ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <Radio className="w-3 h-3 text-gray-600 shrink-0" />
          <span className="text-gray-600">Source:</span>
          <span className="text-gray-400 font-medium truncate">{alert.source}</span>
        </div>

        {/* ── Snapshot carousel ───────────────────────────────────────── */}
        {snapshots.length > 0 && (
          <div className="space-y-2">
            <div className="relative aspect-video bg-dark-900 rounded-xl overflow-hidden
                            border border-dark-600">
              <img
                src={`data:image/jpeg;base64,${snapshots[snap]}`}
                alt={`snapshot ${snap + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Nav arrows */}
              {snapshots.length > 1 && (
                <>
                  <button onClick={prev} disabled={snap === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center
                               justify-center rounded-full bg-black/65 border border-white/10
                               hover:bg-black/85 disabled:opacity-25 transition-all duration-150">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={next} disabled={snap === snapshots.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center
                               justify-center rounded-full bg-black/65 border border-white/10
                               hover:bg-black/85 disabled:opacity-25 transition-all duration-150">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </>
              )}

              {/* Counter pill */}
              <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5
                               bg-black/65 border border-white/10 rounded-full text-white/80">
                {snap + 1} / {snapshots.length}
              </span>
            </div>

            {/* Thumbnail strip */}
            {snapshots.length > 1 && (
              <div className="flex gap-1.5">
                {snapshots.map((src, i) => (
                  <button key={i} onClick={() => setSnap(i)}
                    className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-150
                                ${i === snap ? s.thumbActive : 'border-dark-500 hover:border-dark-400 opacity-60 hover:opacity-90'}`}>
                    <img src={`data:image/jpeg;base64,${src}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Resolve / Resolved ──────────────────────────────────────── */}
        {!alert.resolved ? (
          <button
            onClick={() => onResolve(alert.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       font-bold text-[12px] text-white
                       bg-gradient-to-r from-violet-600/80 to-blue-600/70
                       border border-violet-500/30
                       hover:from-violet-600 hover:to-blue-600
                       hover:shadow-[0_0_16px_rgba(139,92,246,0.35)]
                       transition-all duration-200"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark as Resolved
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl
                          bg-emerald-500/[0.07] border border-emerald-500/20">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-[12px] font-bold">Resolved</span>
          </div>
        )}

      </div>
    </div>
  )
}
