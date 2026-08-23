import { useEffect, useState } from 'react'
import {
  Shield, Eye, Bell, Zap, Camera,
  ChevronRight, Activity, Cpu, ArrowRight,
  CheckCircle, Lock, Wifi, AlertTriangle,
  Server, Code2, Database, Radio, Layers,
} from 'lucide-react'

// ─── Static data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '46.3%', label: 'Overall mAP50',      sub: 'YOLOv8n model accuracy',   color: 'violet' },
  { value: '7',     label: 'Threat Categories',  sub: 'Custom-annotated classes',  color: 'blue'   },
  { value: '85.7%', label: 'Abuse Detection',    sub: 'Highest per-class accuracy', color: 'cyan'   },
  { value: '<50ms', label: 'Inference Speed',    sub: 'GPU-accelerated per frame', color: 'emerald' },
]

const WHY_POINTS = [
  'Detects threats in under 50 ms per frame using GPU acceleration',
  '5-frame consensus algorithm eliminates false positive alerts',
  'Full alert history with visual evidence snapshots and timestamps',
  'Entirely local processing — no cloud upload, no data exposure',
  'Works with webcam, IP cameras, uploaded video, or batch folders',
  'Severity-routed alerts: SAFE → LOW → MEDIUM → HIGH → CRITICAL',
]

const WHY_STATS = [
  { value: '24/7',    label: 'Continuous Monitoring', color: 'violet'  },
  { value: '<50ms',   label: 'Per-frame Inference',   color: 'cyan'    },
  { value: '5-Frame', label: 'Alert Consensus',       color: 'blue'    },
  { value: '100%',    label: 'Local Processing',      color: 'emerald' },
]

const FEATURES = [
  {
    icon: Eye,
    title: 'Real-Time Detection',
    desc: 'GPU-accelerated YOLOv8n processes every frame and returns annotated results with bounding boxes in milliseconds. Handles 12+ FPS from webcam input.',
    tags: ['YOLOv8n', 'CUDA', 'OpenCV'],
    iconCls: 'text-blue-400',
    bgCls:   'bg-blue-500/10',
    ringCls: 'border-blue-500/20',
    glowCls: 'group-hover:shadow-blue-500/10',
  },
  {
    icon: Bell,
    title: 'Smart Alert System',
    desc: '5-frame consensus before firing — eliminating false positives. Multi-snapshot alert cards with full confidence history, severity level, and one-click resolve.',
    tags: ['Consensus', 'Snapshots', 'Severity'],
    iconCls: 'text-amber-400',
    bgCls:   'bg-amber-500/10',
    ringCls: 'border-amber-500/20',
    glowCls: 'group-hover:shadow-amber-500/10',
  },
  {
    icon: Camera,
    title: 'Multi-Source Input',
    desc: 'Webcam, RTSP IP cameras, drag-drop video upload, or folder-based batch processing — all in one unified interface with live switching.',
    tags: ['Webcam', 'RTSP', 'Upload', 'Batch'],
    iconCls: 'text-blue-400',
    bgCls:   'bg-blue-500/10',
    ringCls: 'border-blue-500/20',
    glowCls: 'group-hover:shadow-blue-500/10',
  },
  {
    icon: Zap,
    title: 'CUDA Accelerated',
    desc: 'Full NVIDIA GPU inference pipeline. Automatic CPU fallback ensures the system runs on any machine regardless of hardware availability.',
    tags: ['CUDA 12.7', 'PyTorch 2.5', 'CPU fallback'],
    iconCls: 'text-emerald-400',
    bgCls:   'bg-emerald-500/10',
    ringCls: 'border-emerald-500/20',
    glowCls: 'group-hover:shadow-emerald-500/10',
  },
  {
    icon: Shield,
    title: '5-Level Severity System',
    desc: 'Intelligent severity mapping routes detections through SAFE → LOW → MEDIUM → HIGH → CRITICAL, with HIGH/CRITICAL auto-switching to the alerts panel.',
    tags: ['Auto-routing', '5 Levels', 'Evidence'],
    iconCls: 'text-violet-400',
    bgCls:   'bg-violet-500/10',
    ringCls: 'border-violet-500/20',
    glowCls: 'group-hover:shadow-violet-500/10',
  },
  {
    icon: Activity,
    title: 'Live WebSocket Feed',
    desc: 'Zero-polling architecture. Annotated frames and detection metadata pushed instantly via Socket.IO bidirectional channel with sub-100 ms end-to-end latency.',
    tags: ['Socket.IO', 'Zero-poll', 'Bidirectional'],
    iconCls: 'text-cyan-400',
    bgCls:   'bg-cyan-500/10',
    ringCls: 'border-cyan-500/20',
    glowCls: 'group-hover:shadow-cyan-500/10',
  },
]

const STEPS = [
  {
    num: '01',
    icon: Camera,
    title: 'Connect a Source',
    desc: 'Point SafeAura at any video input — live webcam, RTSP IP camera, uploaded video file, or an entire folder of recordings for batch analysis.',
    color: 'violet',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Analyses Every Frame',
    desc: 'YOLOv8n runs GPU-accelerated inference, classifies threats across 7 categories, draws precise bounding boxes, and streams annotated frames back in real time.',
    color: 'blue',
  },
  {
    num: '03',
    icon: Bell,
    title: 'Alerts Fire Instantly',
    desc: 'Five consecutive threat frames trigger a HIGH or CRITICAL alert — logged with 5 visual snapshots, confidence scores, severity level, and full timestamp.',
    color: 'cyan',
  },
]

const THREATS = [
  {
    name: 'Abuse',
    severity: 'MEDIUM',
    acc: 85.7,
    desc: 'Physical altercations and violence against women in public or private spaces.',
  },
  {
    name: 'Attack',
    severity: 'HIGH',
    acc: 42.3,
    desc: 'Violent physical assault with clear intent to cause bodily harm.',
  },
  {
    name: 'Chain Snatching',
    severity: 'MEDIUM',
    acc: null,
    desc: 'Grab-and-run theft of jewelry, commonly targeting women on streets.',
  },
  {
    name: 'Harassment',
    severity: 'LOW',
    acc: null,
    desc: 'Threatening or intimidating verbal and non-verbal behavior.',
  },
  {
    name: 'Rape',
    severity: 'CRITICAL',
    acc: 56.1,
    desc: 'Sexual assault detection — triggers an immediate CRITICAL alert.',
  },
  {
    name: 'Knife / Gun',
    severity: 'CRITICAL',
    acc: null,
    desc: 'Armed threat detection — highest severity, immediate escalation.',
  },
  {
    name: 'None — Safe',
    severity: 'SAFE',
    acc: null,
    desc: 'No threat detected. System monitors passively and stays on standby.',
  },
]

const TECH = [
  {
    icon: Cpu,
    name: 'YOLOv8n',
    role: 'Object Detection Model',
    desc: 'Ultralytics nano model fine-tuned on 1,365 annotated CCTV images across 7 threat categories. Best checkpoint at epoch 11 of 26.',
    color: 'blue',
  },
  {
    icon: Zap,
    name: 'PyTorch + CUDA 12.7',
    role: 'GPU Acceleration',
    desc: 'Full NVIDIA GPU inference via PyTorch 2.5.1+cu124. Automatic CPU fallback for non-GPU environments.',
    color: 'emerald',
  },
  {
    icon: Server,
    name: 'Flask + Socket.IO',
    role: 'Real-time Backend',
    desc: 'Python REST API with bidirectional WebSocket channel — delivers annotated frames and alert events with sub-100 ms latency.',
    color: 'amber',
  },
  {
    icon: Eye,
    name: 'OpenCV',
    role: 'Frame Processing',
    desc: 'Video capture from webcam and file sources, frame extraction at configurable FPS, and bounding box annotation overlay.',
    color: 'red',
  },
  {
    icon: Code2,
    name: 'React 18 + Vite 5',
    role: 'Frontend',
    desc: 'Fast single-page application with live canvas rendering, Socket.IO client, Tailwind CSS, and full dark/light theme support.',
    color: 'cyan',
  },
  {
    icon: Database,
    name: 'Roboflow',
    role: 'Dataset & Annotation',
    desc: '1,365 images with bounding box annotations, augmentation pipeline, and train/valid/test split management.',
    color: 'violet',
  },
]

const SEVERITY_STYLE = {
  SAFE:     'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  LOW:      'text-yellow-400  border-yellow-500/40  bg-yellow-500/10',
  MEDIUM:   'text-orange-400  border-orange-500/40  bg-orange-500/10',
  HIGH:     'text-red-400     border-red-500/40     bg-red-500/10',
  CRITICAL: 'text-rose-400    border-rose-500/40    bg-rose-500/10',
}

const SEVERITY_BAR = {
  SAFE:     'bg-emerald-500',
  LOW:      'bg-yellow-500',
  MEDIUM:   'bg-orange-500',
  HIGH:     'bg-red-500',
  CRITICAL: 'bg-rose-500',
}

// ─── Mock live-detection card ─────────────────────────────────────────────────

function MockDetectionCard() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2200)
    return () => clearInterval(id)
  }, [])

  const detections = [
    { cls: 'abuse',  conf: 0.91, severity: 'MEDIUM' },
    { cls: 'attack', conf: 0.77, severity: 'HIGH'   },
    { cls: 'none',   conf: 0.62, severity: 'SAFE'   },
  ]
  const cur = detections[tick % detections.length]

  return (
    <div className="relative w-72 rounded-2xl overflow-hidden border border-white/10
                    bg-white/5 backdrop-blur-md shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">CAM-01 · LIVE</span>
        </div>
        <span className="text-[10px] font-mono text-gray-500">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="relative h-36 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-10" />
        <div className="card-scan-line" />
        <div className={`absolute top-6 left-8 w-24 h-20 rounded border-2 transition-all duration-700
          ${cur.severity === 'SAFE' ? 'border-emerald-500/70' : 'border-rose-500/70'}`}>
          <span className={`absolute -top-4 left-0 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase
            ${cur.severity === 'SAFE' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
            {cur.cls} · {Math.round(cur.conf * 100)}%
          </span>
        </div>
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br" />
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Threat Status</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SEVERITY_STYLE[cur.severity]}`}>
            {cur.severity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-dark-600 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${SEVERITY_BAR[cur.severity]}`}
              style={{ width: `${Math.round(cur.conf * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-400">{Math.round(cur.conf * 100)}%</span>
        </div>
        <div className="text-[9px] text-gray-600 pt-1 border-t border-dark-600">
          Frame consensus: 3/5 · Alert threshold: 5 frames
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, desc, tags, iconCls, bgCls, ringCls, glowCls }) {
  return (
    <div className={`group relative p-6 rounded-2xl bg-dark-800 border ${ringCls}
                    transition-all duration-300 hover:-translate-y-1
                    hover:shadow-2xl ${glowCls} overflow-hidden`}>
      {/* Top gradient accent bar */}
      <div className={`absolute top-0 inset-x-0 h-[2px] ${bgCls.replace('/10', '')} opacity-0
                       group-hover:opacity-100 transition-opacity duration-300`} />

      <div className={`w-11 h-11 rounded-xl ${bgCls} border ${ringCls}
                       flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${iconCls}`} />
      </div>

      <h3 className="text-gray-100 font-bold mb-2 text-[15px]">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                    ${bgCls} ${iconCls} border ${ringCls}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function StepCard({ num, title, desc, icon: Icon, color }) {
  const colors = {
    violet:  { icon: 'text-violet-400', bg: 'bg-violet-500/10',  ring: 'border-violet-500/25', badge: 'bg-violet-600 shadow-violet-600/40' },
    blue:    { icon: 'text-blue-400',   bg: 'bg-blue-500/10',    ring: 'border-blue-500/25',   badge: 'bg-blue-600   shadow-blue-600/40'   },
    cyan:    { icon: 'text-cyan-400',   bg: 'bg-cyan-500/10',    ring: 'border-cyan-500/25',   badge: 'bg-cyan-600   shadow-cyan-600/40'   },
  }
  const c = colors[color]
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`relative w-16 h-16 mb-4 rounded-2xl ${c.bg} border ${c.ring}
                       flex flex-col items-center justify-center gap-1
                       group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${c.icon}`} />
        <div className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full ${c.badge}
                         flex items-center justify-center text-[11px] font-black text-white
                         shadow-lg`}>
          {num.replace('0', '')}
        </div>
      </div>
      <h3 className="text-gray-100 font-bold text-base mb-2">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed max-w-xs">{desc}</p>
    </div>
  )
}

function ThreatCard({ name, severity, acc, desc }) {
  return (
    <div className="group p-4 rounded-xl bg-dark-800 border border-dark-600
                    hover:border-dark-500 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-gray-100 font-bold text-sm leading-tight">{name}</h4>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${SEVERITY_STYLE[severity]}`}>
          {severity}
        </span>
      </div>
      <p className="text-gray-600 text-[11px] leading-relaxed mb-3">{desc}</p>
      {acc !== null ? (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-600">mAP50 accuracy</span>
            <span className="text-[10px] font-mono text-gray-400">{acc}%</span>
          </div>
          <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${SEVERITY_BAR[severity]}`} style={{ width: `${acc}%` }} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
          <Radio className="w-3 h-3" />
          Active monitoring
        </div>
      )}
    </div>
  )
}

function TechCard({ icon: Icon, name, role, desc, color }) {
  const colors = {
    blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    ring: 'border-blue-500/20'    },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'border-emerald-500/20' },
    amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   ring: 'border-amber-500/20'   },
    red:     { icon: 'text-red-400',     bg: 'bg-red-500/10',     ring: 'border-red-500/20'     },
    cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    ring: 'border-cyan-500/20'    },
    violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  ring: 'border-violet-500/20'  },
  }
  const c = colors[color]
  return (
    <div className={`p-5 rounded-xl bg-dark-800 border ${c.ring}
                     hover:bg-dark-700 transition-all duration-200 group`}>
      <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.ring}
                       flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="mb-0.5">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${c.icon}`}>{role}</span>
      </div>
      <h4 className="text-gray-100 font-bold text-sm mb-2">{name}</h4>
      <p className="text-gray-600 text-[12px] leading-relaxed">{desc}</p>
    </div>
  )
}

// ─── Main LandingPage ─────────────────────────────────────────────────────────

export default function LandingPage({ onLaunch }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div className="bg-dark-900 text-gray-100">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-92px)] flex items-center overflow-hidden">

        {/* ── Background layers ── */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-grid opacity-[0.14]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line" />
        </div>

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/6  w-80 h-80 bg-violet-600/12 rounded-full blur-3xl float-orb" />
        <div className="absolute top-1/2  right-1/5 w-96 h-96 bg-blue-600/10  rounded-full blur-3xl float-orb-slow" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-600/8   rounded-full blur-3xl float-orb" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-600/8  rounded-full blur-2xl float-orb-slow" />

        {/* Top-left vignette accent */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px]
                        bg-gradient-radial from-violet-600/8 to-transparent pointer-events-none" />

        {/* ── Main two-column grid ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 xl:px-12 py-10">
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 items-center">

            {/* ── LEFT: Content ── */}
            <div className={`transition-all duration-1000
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-5
                              bg-gradient-to-r from-violet-500/15 to-blue-500/10
                              border border-violet-500/30 text-violet-300 text-xs font-semibold
                              tracking-wide shadow-lg shadow-violet-900/20">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                </span>
                AI-Powered Real-Time Surveillance System
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-full
                                 bg-violet-500/20 text-violet-300 text-[10px] font-bold tracking-wider">
                  LIVE
                </span>
              </div>

              {/* Headline */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 mb-2">
                  Introducing
                </div>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[0.9] mb-3 select-none">
                  <span className="text-gray-100">Safe</span>
                  <span className="gradient-text">Aura</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-gray-300 leading-tight">
                  Women's Threat Detection
                  <span className="block text-gray-500 font-normal text-lg md:text-xl mt-0.5">
                    & Alert System
                  </span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-5 max-w-lg">
                Real-time AI surveillance powered by YOLOv8 — autonomously detecting threats
                across 7 categories and firing instant alerts before situations escalate.
                Fully local, fully private, deployable on any existing CCTV infrastructure.
              </p>

              {/* Feature bullets */}
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {[
                  { icon: Eye,         text: 'Real-time YOLOv8 inference — 7 threat classes',   color: 'text-violet-400' },
                  { icon: Bell,        text: '5-frame consensus — zero false positive alerts',   color: 'text-blue-400'   },
                  { icon: Shield,      text: 'Instant HIGH / CRITICAL alert with snapshots',     color: 'text-cyan-400'   },
                  { icon: Lock,        text: '100% local — no cloud upload, no data exposure',   color: 'text-emerald-400'},
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-2.5 p-2.5 rounded-xl
                                             bg-dark-800/50 border border-dark-600/60
                                             hover:border-dark-500 transition-colors">
                    <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${color}`} />
                    <span className="text-gray-400 text-xs leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-5">
                <button
                  onClick={onLaunch}
                  className="group flex items-center gap-3 px-8 py-4
                             bg-gradient-to-r from-violet-600 to-blue-600
                             hover:from-violet-500 hover:to-blue-500
                             text-white font-bold rounded-xl text-base transition-all duration-200
                             shadow-xl shadow-violet-600/35 hover:shadow-violet-500/45 hover:scale-105"
                >
                  <Shield className="w-5 h-5" />
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-4 text-gray-400 hover:text-gray-100
                             border border-dark-500 hover:border-dark-400 rounded-xl text-sm
                             font-medium transition-all duration-200 hover:bg-dark-800/50"
                >
                  Explore Features
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-600
                              pt-4 border-t border-dark-700">
                {[
                  { icon: CheckCircle, label: 'YOLOv8 Trained'   },
                  { icon: Zap,         label: 'CUDA 12.7'         },
                  { icon: Lock,        label: 'Local Processing'  },
                  { icon: Wifi,        label: 'WebSocket Stream'  },
                  { icon: Layers,      label: '5-Level Severity'  },
                ].map(({ icon: I, label }) => (
                  <span key={label} className="flex items-center gap-1.5 hover:text-gray-400 transition-colors">
                    <I className="w-3 h-3" /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Visual stack ── */}
            <div className={`hidden lg:flex flex-col items-center justify-center relative
                             transition-all duration-1000 delay-300
                             ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>

              {/* Glow behind cards */}
              <div className="absolute inset-0 bg-violet-600/10 blur-3xl rounded-full scale-110" />

              {/* Alert notification card — floats top-right */}
              <div className="absolute -top-6 -right-4 w-56 z-20
                              animate-[float-anim_6s_ease-in-out_infinite]">
                <div className="p-3.5 rounded-xl bg-dark-800/95 border border-red-500/30
                                backdrop-blur-md shadow-2xl shadow-black/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400">
                      Critical Alert
                    </span>
                    <span className="ml-auto text-[9px] text-gray-600 font-mono">14:23:07</span>
                  </div>
                  <div className="text-xs text-gray-200 font-bold mb-0.5">Attack Detected</div>
                  <div className="text-[10px] text-gray-500 mb-2.5">CAM-02 · Confidence 77% · 5/5 frames</div>
                  <div className="flex items-center gap-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-7 w-9 rounded bg-dark-700 border border-dark-600
                                              flex items-center justify-center">
                        <div className={`h-4 w-6 rounded-sm ${i === 2 ? 'bg-red-900/60' : 'bg-dark-500'}`} />
                      </div>
                    ))}
                    <span className="text-[9px] text-gray-700 ml-1">+2 more</span>
                  </div>
                </div>
              </div>

              {/* Main detection card */}
              <div className="relative z-10">
                <MockDetectionCard />
              </div>

              {/* Status bar — floats bottom-left */}
              <div className="absolute -bottom-4 -left-4 w-48 z-20
                              animate-[float-anim_8s_ease-in-out_infinite_reverse]">
                <div className="p-3 rounded-xl bg-dark-800/95 border border-emerald-500/25
                                backdrop-blur-md shadow-xl shadow-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">System Status</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Model',   val: 'YOLOv8n',  ok: true  },
                      { label: 'GPU',     val: 'RTX 4050', ok: true  },
                      { label: 'Stream',  val: 'LIVE',     ok: true  },
                    ].map(({ label, val, ok }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-600">{label}</span>
                        <span className={`text-[10px] font-bold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner decoration marks */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-violet-500/40 rounded-tl-lg" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-blue-500/40 rounded-br-lg" />
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-700">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-700 to-transparent" />
        </div>
      </section>

      {/* ═══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="border-y border-dark-600 bg-dark-800/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => {
            const tc = { violet: 'text-violet-400', blue: 'text-blue-400', cyan: 'text-cyan-400', emerald: 'text-emerald-400' }
            return (
              <div key={i} className="text-center group">
                <div className={`text-3xl font-black mb-1 ${tc[s.color]}`}>{s.value}</div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{s.label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{s.sub}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ WHY IT MATTERS ══════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left — text */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-3">The Problem</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-6 leading-tight">
              Reactive systems fail women when seconds matter
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Traditional CCTV monitoring depends on human operators who tire, lose focus, and react
              only after an incident has already escalated. Women in public spaces deserve
              <strong className="text-gray-200"> proactive protection</strong>, not post-incident review.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              SafeAura processes every frame autonomously — 24 hours a day, 7 days a week — flagging
              threats before they become emergencies and building an evidence trail that supports
              rapid, informed response.
            </p>
            <div className="space-y-3">
              {WHY_POINTS.map(point => (
                <div key={point} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mini stat grid */}
          <div className="grid grid-cols-2 gap-4">
            {WHY_STATS.map(({ value, label, color }) => {
              const c = {
                violet:  { text: 'text-violet-400',  bg: 'bg-violet-500/10',  ring: 'border-violet-500/20'  },
                cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    ring: 'border-cyan-500/20'    },
                blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    ring: 'border-blue-500/20'    },
                emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'border-emerald-500/20' },
              }[color]
              return (
                <div key={label} className={`p-4 rounded-2xl ${c.bg} border ${c.ring} text-center
                                            hover:scale-[1.03] transition-transform duration-200`}>
                  <div className={`text-2xl font-black mb-1 ${c.text}`}>{value}</div>
                  <div className="text-xs text-gray-500 leading-tight">{label}</div>
                </div>
              )
            })}
            {/* Mission statement card */}
            <div className="col-span-2 p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10
                            border border-violet-500/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-100 mb-1">Mission Statement</div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  To provide an affordable, deployable AI layer on top of existing CCTV infrastructure —
                  enabling institutions and individuals to respond to women's safety incidents in real time,
                  without cloud dependency or privacy compromise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" className="bg-dark-800/20 border-y border-dark-600">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="text-center mb-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-3">Capabilities</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">
              Built for real-world deployment
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every feature engineered for production-grade surveillance and rapid threat response —
              from the inference pipeline to the alert UI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-3">Workflow</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">
            Three steps to protection
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            From video source to logged alert in under a second — the entire pipeline runs locally on your machine.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)]
                          h-px bg-gradient-to-r from-violet-600/30 via-blue-500/50 to-cyan-600/30" />
          {STEPS.map((s, i) => <StepCard key={i} {...s} />)}
        </div>
      </section>

      {/* ═══ THREAT CLASSES ══════════════════════════════════════════════════ */}
      <section className="bg-dark-800/20 border-y border-dark-600">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="text-center mb-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-3">Detection Model</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">
              7 threat categories detected
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              YOLOv8n trained on 1,365 annotated CCTV images spanning violence, harassment, theft, and armed threat scenarios.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {THREATS.map((t, i) => <ThreatCard key={i} {...t} />)}
          </div>

          {/* Model info strip */}
          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600
                          flex flex-wrap gap-6 items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>YOLOv8n · 26 epochs · best @ epoch 11 · RTX 4050 Laptop GPU</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>1,176 train · 126 valid · 63 test images</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>CUDA 12.7 · PyTorch 2.5.1+cu124</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TECHNOLOGY STACK ════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">Technology</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">
            Full-stack AI pipeline
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every layer — from GPU inference to the React frontend — chosen for performance,
            reliability, and zero external dependency in production.
          </p>
        </div>

        {/* Pipeline arrow strip */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap text-xs text-gray-600 font-mono">
          {['Video Source', 'OpenCV Capture', 'YOLOv8n Inference', 'Socket.IO Stream', 'React UI', 'Alert System'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-dark-800 border border-dark-600 text-gray-400">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-gray-700 shrink-0" />}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH.map((t, i) => <TechCard key={i} {...t} />)}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-violet-950/15 to-dark-900" />
        <div className="absolute inset-0 hero-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-80 h-80 bg-blue-600/6 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                            bg-gradient-to-br from-violet-600/20 to-blue-600/20
                            border border-violet-500/30 mb-5 mx-auto
                            shadow-2xl shadow-violet-600/20">
              <Shield className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">
              Ready to protect?
            </h2>
            <p className="text-gray-400 mb-2 max-w-lg mx-auto text-lg leading-relaxed">
              SafeAura is fully self-hosted — no subscriptions, no cloud accounts,
              no data ever leaving your machine.
            </p>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              Connect any camera source and the AI begins monitoring instantly.
              Alerts fire in real time, evidence is logged automatically.
            </p>
          </div>

          {/* What you get — 4 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: Eye,
                title: 'Live Annotated Feed',
                desc: 'Every frame returned with bounding boxes, class labels, and confidence scores rendered directly on the video canvas.',
                color: 'violet',
              },
              {
                icon: Bell,
                title: 'Instant Alert Firing',
                desc: 'HIGH and CRITICAL threats auto-switch the UI to the Alerts panel. Each alert carries 5 visual snapshots as evidence.',
                color: 'blue',
              },
              {
                icon: Activity,
                title: 'Full Alert History',
                desc: 'Every incident logged with timestamp, severity, confidence, and resolution status. Filter, review, and clear on demand.',
                color: 'cyan',
              },
              {
                icon: Lock,
                title: 'Privacy by Design',
                desc: 'All inference runs locally on your GPU or CPU. No frame, alert, or metadata is ever sent to an external server.',
                color: 'emerald',
              },
            ].map(({ icon: Icon, title, desc, color }) => {
              const c = {
                violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  ring: 'border-violet-500/20'  },
                blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    ring: 'border-blue-500/20'    },
                cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    ring: 'border-cyan-500/20'    },
                emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'border-emerald-500/20' },
              }[color]
              return (
                <div key={title} className={`p-5 rounded-2xl bg-dark-800/80 border ${c.ring}
                                             backdrop-blur-sm hover:-translate-y-1
                                             transition-all duration-200`}>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.ring}
                                   flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                  <h4 className="text-gray-100 font-bold text-sm mb-2">{title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>

          {/* Quick-start steps */}
          <div className="mb-12 p-6 rounded-2xl bg-dark-800/60 border border-dark-600 backdrop-blur-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 mb-5 text-center">
              Get started in 3 steps
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Start the Backend',
                  detail: 'Run the Flask server',
                  cmd: 'python app.py',
                  note: 'Starts on http://localhost:5000 · CUDA auto-detected',
                  color: 'violet',
                },
                {
                  step: '02',
                  title: 'Open the Dashboard',
                  detail: 'Click Launch below',
                  cmd: 'Monitor → Select Source',
                  note: 'Webcam · RTSP · Upload · Folder batch',
                  color: 'blue',
                },
                {
                  step: '03',
                  title: 'Start Monitoring',
                  detail: 'AI analyses in real time',
                  cmd: 'Alerts fire automatically',
                  note: '5-frame consensus · Evidence snapshots · Severity routing',
                  color: 'cyan',
                },
              ].map(({ step, title, detail, cmd, note, color }) => {
                const c = {
                  violet: { text: 'text-violet-400', bg: 'bg-violet-500/10', ring: 'border-violet-500/20', num: 'bg-violet-600' },
                  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   ring: 'border-blue-500/20',   num: 'bg-blue-600'   },
                  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   ring: 'border-cyan-500/20',   num: 'bg-cyan-600'   },
                }[color]
                return (
                  <div key={step} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`${c.num} text-white text-[10px] font-black w-6 h-6
                                        rounded-full flex items-center justify-center shrink-0`}>
                        {step.replace('0', '')}
                      </span>
                      <div>
                        <div className="text-gray-100 font-bold text-sm">{title}</div>
                        <div className="text-gray-600 text-[11px]">{detail}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${c.bg} border ${c.ring} font-mono
                                     text-[11px] ${c.text}`}>
                      {cmd}
                    </div>
                    <p className="text-[10px] text-gray-700 leading-relaxed">{note}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reassurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { icon: Lock,         label: 'No Cloud Upload',      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
              { icon: Zap,          label: 'GPU Accelerated',      color: 'text-cyan-400   bg-cyan-500/10   border-cyan-500/20'   },
              { icon: Shield,       label: 'Privacy First',        color: 'text-blue-400   bg-blue-500/10   border-blue-500/20'   },
              { icon: CheckCircle,  label: 'Fully Self-Hosted',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { icon: Wifi,         label: 'Real-time WebSocket',  color: 'text-amber-400  bg-amber-500/10  border-amber-500/20'  },
              { icon: Activity,     label: 'Evidence Logged',      color: 'text-rose-400   bg-rose-500/10   border-rose-500/20'   },
            ].map(({ icon: Icon, label, color }) => (
              <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5
                                            rounded-full border text-[11px] font-semibold ${color}`}>
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onLaunch}
              className="group inline-flex items-center gap-3 px-10 py-5
                         bg-gradient-to-r from-violet-600 to-blue-600
                         hover:from-violet-500 hover:to-blue-500
                         text-white font-bold rounded-2xl text-lg transition-all duration-200
                         shadow-2xl shadow-violet-600/40 hover:shadow-violet-500/50 hover:scale-105 mb-5"
            >
              <Shield className="w-6 h-6" />
              Launch SafeAura Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1
                            text-[11px] text-gray-700">
              <span>Python 3.10+ required</span>
              <span>·</span>
              <span>CUDA GPU optional (CPU fallback available)</span>
              <span>·</span>
              <span>Modern browser</span>
              <span>·</span>
              <span>No internet connection needed</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-dark-600 bg-dark-800/60">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-6">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600
                                flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-black text-gray-100 text-sm">SafeAura</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Women's Threat Detection and Alert System. Real-time AI surveillance for a safer world.
              </p>
            </div>

            {/* Features */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Features</div>
              <ul className="space-y-2 text-xs text-gray-600">
                {['Real-Time Detection', 'Smart Alert System', 'Multi-Source Input', 'CUDA Accelerated', 'Live WebSocket Feed', '5-Level Severity'].map(f => (
                  <li key={f} className="hover:text-gray-400 transition-colors cursor-default">{f}</li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Tech Stack</div>
              <ul className="space-y-2 text-xs text-gray-600">
                {['YOLOv8n (Ultralytics)', 'PyTorch 2.5 + CUDA 12.7', 'Flask + Socket.IO', 'OpenCV 4.x', 'React 18 + Vite 5', 'Tailwind CSS 3'].map(t => (
                  <li key={t} className="hover:text-gray-400 transition-colors cursor-default">{t}</li>
                ))}
              </ul>
            </div>

            {/* Project info */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Project</div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>Final Year B.Tech Project</li>
                <li>1,365 training images</li>
                <li>7 threat categories</li>
                <li>RTX 4050 Laptop GPU</li>
                <li>46.3% overall mAP50</li>
                <li>Local-only processing</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-dark-600 pt-4 flex flex-col md:flex-row
                          items-center justify-between gap-3 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-gray-500 font-medium">SafeAura</span>
              <span>· Women's Threat Detection and Alert System</span>
            </div>
            <div>
              Final Year Project · YOLOv8 · Flask · Socket.IO · React + Vite
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
