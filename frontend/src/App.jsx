import { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import socket from './socket'
import Header from './components/Header'
import MonitorPage from './components/MonitorPage'
import AlertPanel from './components/AlertPanel'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import FeedbackPage from './components/FeedbackPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('Landing')

  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('sa-theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('sa-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // Connection / model state
  const [connected, setConnected] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Live video state
  const [frame, setFrame] = useState(null)
  const [status, setStatus] = useState('SAFE')
  const [detections, setDetections] = useState([])
  const [streamEnded, setStreamEnded] = useState(false)

  // Alerts
  const [alerts, setAlerts] = useState([])

  // ---------------------------------------------------------------
  // Socket events
  // ---------------------------------------------------------------
  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('connected', ({ model_loaded }) => setModelLoaded(model_loaded))

    // Frames from uploaded video / RTSP backend stream
    socket.on('video_frame', ({ frame: f, detections: d, is_threat, status: s }) => {
      setFrame(f)
      setDetections(d ?? [])
      setStatus(s)
      setStreamEnded(false)
    })

    // Frames from webcam (sent back annotated)
    socket.on('annotated_frame', ({ frame: f, detections: d, status: s }) => {
      setFrame(f)
      setDetections(d ?? [])
      setStatus(s)
    })

    socket.on('stream_started', () => setStreamEnded(false))
    socket.on('stream_ended', () => setStreamEnded(true))
    socket.on('stream_error', ({ message }) => console.error('Stream error:', message))

    // Alerts
    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 200))
      // Switch to alerts tab briefly to flash
      setActiveTab(tab => {
        if (alert.severity === 'CRITICAL' || alert.severity === 'HIGH') return 'Alerts'
        return tab
      })
    })

    socket.on('alerts_cleared', () => setAlerts([]))

    socket.on('alert_resolved', ({ id }) => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
    })

    // Load existing alerts on mount
    fetch('/api/alerts')
      .then(r => r.json())
      .then(data => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => {})

    // Health check
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setModelLoaded(d.model_loaded))
      .catch(() => {})

    return () => socket.removeAllListeners()
  }, [])

  // ---------------------------------------------------------------
  // Alert actions
  // ---------------------------------------------------------------
  const resolveAlert = useCallback(async (id) => {
    await fetch(`/api/alerts/${id}/resolve`, { method: 'POST' })
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
  }, [])

  const clearAlerts = useCallback(async () => {
    await fetch('/api/alerts/clear', { method: 'POST' })
    setAlerts([])
  }, [])

  const unresolved = alerts.filter(a => !a.resolved).length

  // ── Scroll-to-top ───────────────────────────────────────────────────────
  const scrollRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setShowScrollTop(el.scrollTop > 300)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  // ---------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen bg-dark-900 text-gray-100">
      <Header
        connected={connected}
        modelLoaded={modelLoaded}
        alertCount={unresolved}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 overflow-hidden pt-[104px]">
        <div ref={scrollRef} className={`h-full overflow-y-auto ${!['Landing', 'About', 'Contact', 'Feedback'].includes(activeTab) ? 'p-4' : ''}`}>
          {activeTab === 'Landing' && (
            <LandingPage onLaunch={() => setActiveTab('Monitor')} />
          )}

          {activeTab === 'Monitor' && (
            <MonitorPage
              frame={frame}
              status={status}
              detections={detections}
              streamEnded={streamEnded}
            />
          )}

          {activeTab === 'Alerts' && (
            <AlertPanel
              alerts={alerts}
              onResolve={resolveAlert}
              onClear={clearAlerts}
            />
          )}

          {activeTab === 'About'    && <AboutPage />}
          {activeTab === 'Contact'  && <ContactPage />}
          {activeTab === 'Feedback' && <FeedbackPage />}
        </div>
      </main>

      {/* ── Scroll-to-top button ─────────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        title="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-[48px] w-[48px] items-center justify-center
                    rounded-full border-2 border-violet-500/70
                    bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600
                    text-white backdrop-blur-md
                    shadow-[0_0_24px_rgba(139,92,246,0.60),0_4px_12px_rgba(0,0,0,0.40),inset_0_1px_0_rgba(255,255,255,0.20)]
                    hover:border-violet-400 hover:scale-110
                    hover:shadow-[0_0_36px_rgba(139,92,246,0.85),0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
                    transition-all duration-300
                    ${showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp className="h-[18px] w-[18px] stroke-[2.5]" />
      </button>
    </div>
  )
}
