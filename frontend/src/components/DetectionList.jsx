import { ShieldCheck, AlertTriangle, Zap } from 'lucide-react'

const SEV = {
  SAFE:     { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/[0.07] border-emerald-500/20', icon: <ShieldCheck  className="w-3 h-3" />, conf: 'bg-emerald-500' },
  LOW:      { bar: 'bg-yellow-500',  text: 'text-yellow-400',  bg: 'bg-yellow-500/[0.07]  border-yellow-500/20',  icon: <AlertTriangle className="w-3 h-3" />, conf: 'bg-yellow-500'  },
  MEDIUM:   { bar: 'bg-orange-500',  text: 'text-orange-400',  bg: 'bg-orange-500/[0.07]  border-orange-500/20',  icon: <AlertTriangle className="w-3 h-3" />, conf: 'bg-orange-500'  },
  HIGH:     { bar: 'bg-red-500',     text: 'text-red-400',     bg: 'bg-red-500/[0.07]     border-red-500/20',     icon: <Zap           className="w-3 h-3" />, conf: 'bg-red-500'     },
  CRITICAL: { bar: 'bg-rose-500',    text: 'text-rose-400',    bg: 'bg-rose-500/[0.08]    border-rose-500/25',    icon: <Zap           className="w-3 h-3" />, conf: 'bg-rose-500'    },
}

export default function DetectionList({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <ShieldCheck className="w-8 h-8 text-gray-700" />
        <p className="text-gray-600 text-[11.5px] font-medium">No detections in current frame</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {detections.map((d, i) => {
        const s = SEV[d.severity] || SEV.MEDIUM
        const pct = Math.round((d.confidence ?? 0) * 100)
        return (
          <li key={i}
            className={`rounded-xl border overflow-hidden transition-all duration-200 ${s.bg}`}>
            {/* Top accent bar */}
            <div className={`h-[2px] w-full ${s.bar}`} />

            <div className="px-3 py-2.5 space-y-2">
              {/* Class + severity */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={s.text}>{s.icon}</span>
                  <span className="text-gray-100 font-bold text-[12px] capitalize truncate">
                    {d.class?.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`shrink-0 text-[9.5px] font-black tracking-[0.1em] uppercase ${s.text}`}>
                  {d.severity}
                </span>
              </div>

              {/* Confidence bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-[9.5px] font-bold tracking-[0.06em] uppercase">Confidence</span>
                  <span className={`text-[10px] font-black font-mono ${s.text}`}>{pct}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-dark-600 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${s.conf}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
