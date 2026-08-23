import { useState } from 'react'
import { Radio, StopCircle } from 'lucide-react'

export default function RTSPFeed({ onStart, onStop }) {
  const [url, setUrl] = useState('')
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')

  const start = async () => {
    setError('')
    if (!url.trim()) { setError('Enter an RTSP URL'); return }

    try {
      const res = await fetch('/api/stream/rtsp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setActive(true)
        onStart?.('rtsp')
      } else {
        setError(data.error || 'Failed to start stream')
      }
    } catch {
      setError('Network error — is the backend running?')
    }
  }

  const stop = async () => {
    await fetch('/api/stream/stop', { method: 'POST' })
    setActive(false)
    onStop?.()
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        RTSP Stream URL
      </label>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        disabled={active}
        placeholder="rtsp://username:password@192.168.1.x:554/stream"
        className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5
                   text-sm text-gray-200 placeholder-gray-600 focus:outline-none
                   focus:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded border border-red-800">
          {error}
        </p>
      )}
      <button
        onClick={active ? stop : start}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                    font-medium text-sm transition-colors
                    ${active
                      ? 'bg-red-700 hover:bg-red-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
      >
        {active ? (
          <><StopCircle className="w-4 h-4" /> Disconnect</>
        ) : (
          <><Radio className="w-4 h-4" /> Connect Stream</>
        )}
      </button>
    </div>
  )
}
