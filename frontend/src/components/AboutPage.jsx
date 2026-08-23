import {
  Shield, Eye, Bell, Zap, Camera, CheckCircle, Lock,
  Cpu, Layers, Activity, Server, Users, Target, Heart,
  ArrowRight, Code2, GraduationCap, Globe, Mail, Github,
  BookOpen, MapPin, Award, Lightbulb,
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    icon: Shield,
    title: 'Protection First',
    desc: 'Every design decision prioritises women\'s safety above all else — speed, accuracy, and reliability are non-negotiable.',
    glow: 'from-violet-600/20 to-violet-600/0',
    ring: 'border-violet-500/20',
    iconCls: 'text-violet-400',
  },
  {
    icon: Eye,
    title: 'Real-Time Intelligence',
    desc: 'Millisecond-latency threat detection powered by an optimised YOLOv8n model running directly on live camera streams.',
    glow: 'from-cyan-600/20 to-cyan-600/0',
    ring: 'border-cyan-500/20',
    iconCls: 'text-cyan-400',
  },
  {
    icon: Bell,
    title: 'Immediate Alerts',
    desc: 'Multi-channel alert system that delivers context-rich notifications the instant a threat is classified.',
    glow: 'from-purple-600/20 to-purple-600/0',
    ring: 'border-purple-500/20',
    iconCls: 'text-purple-400',
  },
  {
    icon: Lock,
    title: 'Privacy by Design',
    desc: 'On-device inference with strict data minimisation — surveillance in service of safety, nothing more.',
    glow: 'from-emerald-600/20 to-emerald-600/0',
    ring: 'border-emerald-500/20',
    iconCls: 'text-emerald-400',
  },
]

const PROBLEM_STATS = [
  { value: '70%',    label: 'of women globally have experienced sexual harassment in public spaces', color: 'text-red-400'    },
  { value: '< 3s',   label: 'window where rapid AI intervention can prevent escalation of a threat', color: 'text-violet-400' },
  { value: '24/7',   label: 'coverage gap that existing manual monitoring systems cannot sustain',   color: 'text-cyan-400'   },
  { value: '1 in 3', label: 'women faces physical or sexual violence in her lifetime (UN Women data)', color: 'text-amber-400' },
]

const TEAM_MEMBERS = [
  {
    initials: 'TL',
    name: 'Team Lead',
    role: 'Full Stack Developer',
    desc: 'System architecture, real-time pipeline design, and React frontend integration.',
    color: 'from-violet-600 to-purple-700',
    tags: ['React', 'Flask', 'WebSocket'],
  },
  {
    initials: 'AE',
    name: 'AI Engineer',
    role: 'Machine Learning',
    desc: 'YOLOv8n model fine-tuning, dataset curation, and inference optimisation.',
    color: 'from-cyan-600 to-blue-700',
    tags: ['YOLOv8', 'Python', 'OpenCV'],
  },
  {
    initials: 'BD',
    name: 'Backend Dev',
    role: 'Server & Infrastructure',
    desc: 'WebSocket server, REST API design, alert routing, and database schema.',
    color: 'from-purple-600 to-violet-800',
    tags: ['Flask', 'SocketIO', 'SQLite'],
  },
  {
    initials: 'FD',
    name: 'UI/UX Designer',
    role: 'Frontend & Design',
    desc: 'Component library, design system, responsive layout, and accessibility.',
    color: 'from-blue-600 to-cyan-700',
    tags: ['Tailwind', 'Figma', 'Vite'],
  },
]

const TECH_STACK = [
  {
    name: 'YOLOv8n',
    category: 'AI Model',
    icon: Cpu,
    desc: 'Nano variant fine-tuned for threat posture classification at 30+ FPS.',
    accent: 'violet',
  },
  {
    name: 'Python / Flask',
    category: 'Backend',
    icon: Server,
    desc: 'Lightweight async server with Flask-SocketIO for real-time frame relay.',
    accent: 'blue',
  },
  {
    name: 'React 18 + Vite',
    category: 'Frontend',
    icon: Layers,
    desc: 'Component-based UI with sub-100ms HMR and Tailwind CSS design system.',
    accent: 'cyan',
  },
  {
    name: 'WebSocket',
    category: 'Transport',
    icon: Activity,
    desc: 'Full-duplex bidirectional channel keeps latency under 80 ms end-to-end.',
    accent: 'emerald',
  },
  {
    name: 'OpenCV',
    category: 'Vision',
    icon: Camera,
    desc: 'Frame capture, pre-processing pipeline, and bounding-box annotation.',
    accent: 'amber',
  },
  {
    name: 'Ultralytics',
    category: 'Training',
    icon: Zap,
    desc: 'Production YOLO framework with transfer learning from COCO pre-weights.',
    accent: 'purple',
  },
]

const ACCENT = {
  violet:  { card: 'border-violet-500/20 hover:border-violet-500/40',  icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20',  tag: 'text-violet-300' },
  blue:    { card: 'border-blue-500/20   hover:border-blue-500/40',    icon: 'text-blue-400   bg-blue-500/10   border-blue-500/20',    tag: 'text-blue-300'   },
  cyan:    { card: 'border-cyan-500/20   hover:border-cyan-500/40',    icon: 'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',    tag: 'text-cyan-300'   },
  emerald: { card: 'border-emerald-500/20 hover:border-emerald-500/40',icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',tag: 'text-emerald-300'},
  amber:   { card: 'border-amber-500/20  hover:border-amber-500/40',   icon: 'text-amber-400  bg-amber-500/10  border-amber-500/20',   tag: 'text-amber-300'  },
  purple:  { card: 'border-purple-500/20 hover:border-purple-500/40',  icon: 'text-purple-400 bg-purple-500/10 border-purple-500/20',  tag: 'text-purple-300' },
}

const TIMELINE = [
  { phase: '01', title: 'Research & Planning',      desc: 'Problem scoping, dataset research, threat taxonomy definition, and tech stack selection.',     done: true  },
  { phase: '02', title: 'Dataset & Model Training', desc: 'Custom dataset curation, YOLOv8n fine-tuning on threat posture classes, benchmark evaluation.', done: true  },
  { phase: '03', title: 'Backend Integration',      desc: 'Flask WebSocket server, frame ingestion pipeline, alert classification engine.',                done: true  },
  { phase: '04', title: 'Frontend Development',     desc: 'React dashboard, live monitor view, alert panel, glassmorphism design system.',                 done: true  },
  { phase: '05', title: 'Testing & Optimisation',   desc: 'Edge-case stress testing, latency tuning, light/dark theme polish, cross-browser QA.',         done: true  },
  { phase: '06', title: 'Deployment & Showcase',    desc: 'Production build, live demonstration, final documentation and submission.',                     done: false },
]

const ROADMAP = [
  { icon: Globe,   text: 'SMS / email alert relay so family or emergency contacts are notified instantly.' },
  { icon: Target,  text: 'Mobile app (React Native) enabling remote monitoring from any smartphone.' },
  { icon: Camera,  text: 'Night-vision and IR camera support for low-light and outdoor environments.' },
  { icon: Layers,  text: 'Multi-camera grid view for large-venue or campus-wide deployment.' },
  { icon: Shield,  text: 'Federated learning pipeline for privacy-preserving model improvement.' },
  { icon: Bell,    text: 'Direct integration with national emergency services (112 / SOS) APIs.' },
]

/* ─── Sub-components ────────────────────────────────────────────────────── */

function SectionHeader({ tag, title, sub }) {
  return (
    <div className="text-center mb-10">
      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase
                       bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        <span className="text-gray-100">{title.split('|')[0]}</span>
        {title.split('|')[1] && (
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400
                           bg-clip-text text-transparent">
            {title.split('|')[1]}
          </span>
        )}
      </h2>
      {sub && <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{sub}</p>}
    </div>
  )
}

function TechCard({ name, category, icon: Icon, desc, accent }) {
  const a = ACCENT[accent]
  return (
    <div className={`relative group bg-dark-800 border ${a.card} rounded-2xl p-5 transition-all duration-300 hover:bg-dark-700`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${a.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <span className={`text-[9px] font-bold tracking-[0.14em] uppercase ${a.tag}`}>{category}</span>
          <h3 className="text-gray-100 font-bold text-[13px] mt-0.5 mb-1.5">{name}</h3>
          <p className="text-gray-500 text-[11.5px] leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  )
}

function TeamCard({ initials, name, role, desc, color, tags }) {
  return (
    <div className="group relative bg-dark-800 border border-dark-600 rounded-2xl p-6
                    hover:bg-dark-700 hover:border-violet-500/25 transition-all duration-300">
      {/* Avatar */}
      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center
                        shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-4 font-black text-white text-lg`}>
        {initials}
      </div>
      <div className="mb-1 text-[10px] font-bold tracking-[0.12em] uppercase text-violet-400">{role}</div>
      <h3 className="text-gray-100 font-bold text-[14px] mb-2">{name}</h3>
      <p className="text-gray-500 text-[11.5px] leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="px-2 py-0.5 rounded-md text-[9.5px] font-bold tracking-wide
                                    bg-dark-700 border border-dark-600 text-gray-500">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-92px)] text-gray-100">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-900 py-16">
        {/* Background orbs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px]
                        rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="pointer-events-none absolute -top-24 right-1/4 h-[400px] w-[400px]
                        rounded-full bg-cyan-600/[0.08] blur-[100px]" />
        {/* Grid overlay */}
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-violet-500/10 border border-violet-500/20 text-[10px]
                          font-bold tracking-[0.15em] uppercase text-violet-400 mb-8">
            <BookOpen className="h-3 w-3" />
            Final Year Project — Computer Science &amp; Engineering
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] mb-6 leading-[1.08]">
            <span className="text-gray-100">About </span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400
                             bg-clip-text text-transparent">
              SafeAura
            </span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            A real-time AI-powered women's threat detection system built by a team of passionate
            engineers who believe technology should protect the vulnerable, not just the privileged.
          </p>

          {/* Quick facts strip */}
          <div className="inline-flex flex-wrap justify-center gap-6 px-8 py-4 rounded-2xl
                          bg-dark-800 border border-dark-600">
            {[
              { label: 'Built with', value: 'YOLOv8n'        },
              { label: 'Latency',    value: '< 80 ms'        },
              { label: 'Threat classes', value: '6 types'    },
              { label: 'Stack',      value: 'Python + React' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-gray-100 font-black text-[15px]">{value}</div>
                <div className="text-gray-500 text-[9.5px] font-bold tracking-[0.1em] uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Pillars ─────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Our Mission"
            title="Built to |Protect & Empower"
            sub="SafeAura was born from a simple conviction: every woman deserves to move through the world without fear. We combine state-of-the-art computer vision with real-time alerting to turn passive cameras into active defenders."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(({ icon: Icon, title, desc, glow, ring, iconCls }) => (
              <div key={title}
                className={`relative group bg-dark-800 border ${ring} rounded-2xl p-6
                            hover:bg-dark-700 transition-all duration-300 overflow-hidden`}>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${glow} opacity-0
                                  group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`h-10 w-10 rounded-xl border ${ring} bg-dark-700 flex items-center
                                  justify-center mb-4 relative z-10`}>
                  <Icon className={`h-[18px] w-[18px] ${iconCls}`} />
                </div>
                <h3 className="text-gray-100 font-bold text-[13.5px] mb-2 relative z-10">{title}</h3>
                <p className="text-gray-500 text-[11.5px] leading-relaxed relative z-10">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem statement ─────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="The Problem"
            title="Why This |Matters"
            sub="The scale of gender-based violence is a global crisis. Existing solutions rely on human reaction time — too slow for real emergencies. We built SafeAura to close that gap."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {PROBLEM_STATS.map(({ value, label, color }) => (
              <div key={value} className="bg-dark-700 border border-dark-600 rounded-2xl p-6 text-center">
                <div className={`text-3xl font-black mb-2 ${color}`}>{value}</div>
                <p className="text-gray-500 text-[11px] leading-relaxed">{label}</p>
              </div>
            ))}
          </div>

          {/* Two-column problem vs solution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-400 text-[10px] font-bold tracking-[0.14em] uppercase">The Problem</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Manual CCTV monitoring requires constant human attention — impossible to scale',
                  'Response time depends on operator alertness, leading to critical delays',
                  'Traditional systems trigger alerts only after incidents escalate visibly',
                  'No intelligent classification — security staff overwhelmed with false positives',
                ].map(t => (
                  <li key={t} className="flex gap-2.5 text-gray-500 text-[12px] leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/60" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-violet-500/[0.05] border border-violet-500/20 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-violet-400 text-[10px] font-bold tracking-[0.14em] uppercase">The SafeAura Solution</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Autonomous AI monitoring that never blinks, fatigues, or gets distracted',
                  'Sub-80ms threat detection window — faster than any human can react',
                  'Proactive classification of threatening postures before incidents escalate',
                  'Precision severity scoring eliminates noise and surfaces only real threats',
                ].map(t => (
                  <li key={t} className="flex gap-2.5 text-gray-400 text-[12px] leading-relaxed">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="The Team"
            title="People |Behind SafeAura"
            sub="A cross-functional team of final-year engineering students united by one goal: making real-time AI safety accessible and effective."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_MEMBERS.map(m => <TeamCard key={m.role} {...m} />)}
          </div>

          {/* Institute badge */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl
                            bg-dark-800 border border-dark-600">
              <GraduationCap className="h-5 w-5 text-violet-400 shrink-0" />
              <div>
                <div className="text-gray-100 font-bold text-[12.5px]">Final Year B.Tech Project</div>
                <div className="text-gray-500 text-[10.5px]">Computer Science &amp; Engineering · 2025–26</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Technology Stack ──────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-800">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Technology"
            title="How It Was |Built"
            sub="Every layer of the stack was chosen for raw performance, not familiarity — the right tool for a mission-critical safety application."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map(t => <TechCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── Development Timeline ──────────────────────────────────────────── */}
      <section className="py-14 bg-dark-900">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader
            tag="Development Journey"
            title="From Idea to |Reality"
            sub="Six structured phases over eight months, from whiteboard to working real-time system."
          />

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-3 bottom-3 w-px
                            bg-gradient-to-b from-violet-500/60 via-violet-500/20 to-transparent
                            hidden sm:block" />

            <div className="space-y-4">
              {TIMELINE.map(({ phase, title, desc, done }) => (
                <div key={phase} className="flex gap-5">
                  {/* Phase dot */}
                  <div className="relative shrink-0 hidden sm:flex">
                    <div className={`h-[46px] w-[46px] rounded-full flex items-center justify-center
                                    text-[10px] font-black border transition-all duration-200
                                    ${done
                                      ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'}`}>
                      {done ? <CheckCircle className="h-4 w-4" /> : phase}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-xl p-4 border transition-all duration-200
                                  ${done
                                    ? 'bg-violet-500/[0.04] border-violet-500/15'
                                    : 'bg-amber-500/[0.05] border-amber-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold tracking-[0.14em] uppercase
                                        ${done ? 'text-violet-400' : 'text-amber-400'}`}>
                        Phase {phase}
                      </span>
                      {!done && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full
                                          bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-100 font-bold text-[13px] mb-1">{title}</h3>
                    <p className="text-gray-500 text-[11.5px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-800">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader
            tag="What's Next"
            title="Future |Roadmap"
            sub="SafeAura is a foundation, not a final product. Here's where we're taking it next."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex gap-3.5 bg-dark-700 border border-dark-600
                                       rounded-xl p-4 hover:border-violet-500/25
                                       hover:bg-dark-600 transition-all duration-200 group">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-500/10 border border-violet-500/20
                                  flex items-center justify-center group-hover:bg-violet-500/15 transition-colors">
                  <Icon className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <p className="text-gray-500 text-[11.5px] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Closing ─────────────────────────────────────────────── */}
      <section className="py-14 bg-dark-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden
                          bg-gradient-to-br from-violet-600/10 via-purple-600/[0.05] to-cyan-600/[0.08]
                          border border-violet-500/20 p-10">
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48
                            rounded-full bg-violet-600/15 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48
                            rounded-full bg-cyan-600/10 blur-[60px]" />

            <div className="relative z-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-5
                              bg-gradient-to-br from-violet-500 via-purple-600 to-cyan-500
                              shadow-[0_0_24px_rgba(139,92,246,0.50)]">
                <Heart className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                <span className="text-gray-100">Built with purpose, </span>
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  shipped with care
                </span>
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
                SafeAura is an academic research project with real-world ambitions. We welcome
                feedback, collaboration, and ideas from anyone who shares our commitment to
                making public spaces safer for women everywhere.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a href="mailto:team@safeguard.example.com"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[12px]
                              bg-gradient-to-r from-violet-600 to-blue-600 text-white
                              shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]
                              transition-all duration-200 hover:scale-[1.03]">
                  <Mail className="h-3.5 w-3.5" />
                  Contact the Team
                </a>
                <a href="https://github.com"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[12px]
                              bg-dark-700 border border-dark-600 text-gray-400
                              hover:bg-dark-600 hover:text-gray-100 hover:border-dark-500
                              transition-all duration-200">
                  <Github className="h-3.5 w-3.5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="bg-dark-900 border-t border-dark-600 py-5">
        <p className="text-center text-gray-600 text-[11px]">
          © 2025–26 SafeAura Team · Women's Threat Detection &amp; Alert System · Final Year Project
        </p>
      </div>

    </div>
  )
}
