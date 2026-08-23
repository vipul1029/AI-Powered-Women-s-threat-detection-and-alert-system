import { useState } from 'react'
import { Bell, Trash2, Filter, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react'
import AlertCard from './AlertCard'

const SEVERITY_LEVELS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const FILTER_STYLE = {
  ALL:      { active: 'bg-violet-600/25 border-violet-500/50 text-violet-300',      dot: 'bg-violet-400'  },
  LOW:      { active: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',      dot: 'bg-yellow-400'  },
  MEDIUM:   { active: 'bg-orange-500/20 border-orange-500/50 text-orange-300',      dot: 'bg-orange-400'  },
  HIGH:     { active: 'bg-red-500/20    border-red-500/50    text-red-300',         dot: 'bg-red-400'     },
  CRITICAL: { active: 'bg-rose-600/25   border-rose-500/50   text-rose-300',        dot: 'bg-rose-400'    },
}

export default function AlertPanel({ alerts, onResolve, onClear }) {
  const [filter, setFilter] = useState('ALL')

  const filtered   = filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter)
  const unresolved = alerts.filter(a => !a.resolved).length
  const resolved   = alerts.filter(a =>  a.resolved).length
  const critical   = alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length

  return (
    <div className="flex flex-col h-full gap-4">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 rounded-2xl bg-dark-800 border border-dark-600 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-red-500
                            flex items-center justify-center
                            shadow-[0_0_16px_rgba(139,92,246,0.45)]">
              <Bell className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-100 font-black text-[16px] leading-tight">Alert Log</h2>
              <p className="text-gray-500 text-[11px]">Real-time threat notifications</p>
            </div>
          </div>

          {alerts.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold
                         border border-red-500/20 bg-red-500/[0.06] text-red-400
                         hover:bg-red-500/15 hover:border-red-500/40 transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-dark-700 border border-dark-600 px-4 py-3 text-center">
            <div className="text-gray-100 font-black text-[20px] leading-none mb-1">{alerts.length}</div>
            <div className="text-gray-500 text-[10px] font-bold tracking-[0.08em] uppercase">Total</div>
          </div>
          <div className={`rounded-xl border px-4 py-3 text-center transition-colors
                          ${unresolved > 0
                            ? 'bg-violet-500/[0.08] border-violet-500/25'
                            : 'bg-dark-700 border-dark-600'}`}>
            <div className={`font-black text-[20px] leading-none mb-1
                            ${unresolved > 0 ? 'text-violet-300' : 'text-gray-100'}`}>
              {unresolved}
            </div>
            <div className="text-gray-500 text-[10px] font-bold tracking-[0.08em] uppercase">Unresolved</div>
          </div>
          <div className={`rounded-xl border px-4 py-3 text-center transition-colors
                          ${critical > 0
                            ? 'bg-red-500/[0.08] border-red-500/25'
                            : 'bg-dark-700 border-dark-600'}`}>
            <div className={`font-black text-[20px] leading-none mb-1
                            ${critical > 0 ? 'text-red-400' : 'text-gray-100'}`}>
              {critical}
            </div>
            <div className="text-gray-500 text-[10px] font-bold tracking-[0.08em] uppercase">Critical</div>
          </div>
        </div>
      </div>

      {/* ── Severity filter ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-gray-600 shrink-0" />
        {SEVERITY_LEVELS.map(lvl => {
          const s = FILTER_STYLE[lvl]
          const isActive = filter === lvl
          const count = lvl === 'ALL' ? alerts.length : alerts.filter(a => a.severity === lvl).length
          return (
            <button key={lvl} onClick={() => setFilter(lvl)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold
                          border transition-all duration-200
                          ${isActive
                            ? s.active
                            : 'border-dark-600 bg-dark-700 text-gray-500 hover:text-gray-300 hover:border-dark-500'}`}
            >
              {lvl !== 'ALL' && (
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? s.dot : 'bg-gray-600'}`} />
              )}
              {lvl}
              {count > 0 && (
                <span className={`text-[9px] font-black px-1 py-0.5 rounded-full
                                  ${isActive ? 'bg-white/20' : 'bg-dark-600 text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Alert list ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-16 w-16 rounded-2xl bg-dark-800 border border-dark-600
                            flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-400 font-bold text-[14px] mb-1">
                {alerts.length === 0 ? 'No alerts yet' : 'No alerts match this filter'}
              </p>
              <p className="text-gray-600 text-[12px]">
                {alerts.length === 0
                  ? 'Threats detected by the AI will appear here in real time'
                  : `Try selecting a different severity level`}
              </p>
            </div>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} onResolve={onResolve} />
          ))
        )}
      </div>
    </div>
  )
}
