import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff } from 'lucide-react'
import socket from '../socket'

const FRAME_INTERVAL_MS = 80  // ~12 fps to server

export default function WebcamFeed({ onStart, onStop }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')

  const start = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setActive(true)
      onStart?.('webcam')
      startSending()
    } catch (e) {
      setError(e.message || 'Camera access denied')
    }
  }

  const stop = () => {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setActive(false)
    onStop?.()
    fetch('/api/stream/stop', { method: 'POST' })
  }

  const startSending = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    timerRef.current = setInterval(() => {
      const video = videoRef.current
      if (!video || video.readyState < 2) return

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const dataURL = canvas.toDataURL('image/jpeg', 0.75)
      socket.emit('webcam_frame', { frame: dataURL })
    }, FRAME_INTERVAL_MS)
  }

  useEffect(() => () => { clearInterval(timerRef.current) }, [])

  return (
    <div className="space-y-3">
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

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
          <><CameraOff className="w-4 h-4" /> Stop Webcam</>
        ) : (
          <><Camera className="w-4 h-4" /> Start Webcam</>
        )}
      </button>

      {active && (
        <p className="text-xs text-center text-gray-500">
          Streaming from webcam — annotated view shown in player above
        </p>
      )}
    </div>
  )
}
