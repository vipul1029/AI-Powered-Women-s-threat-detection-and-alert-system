import { useEffect, useRef } from 'react'
import { Video, Wifi, WifiOff, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function VideoCanvas({ frameSrc, status }) {
  const imgRef  = useRef(null)
  const isUnsafe = status === 'UNSAFE'

  useEffect(() => {
    if (imgRef.current && frameSrc) imgRef.current.src = frameSrc
  }, [frameSrc])

  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden
                     border-2 transition-all duration-300
                     ${isUnsafe
                       ? 'border-red-500/70 shadow-[0_0_32px_rgba(239,68,68,0.35)]'
                       : frameSrc
                         ? 'border-emerald-500/30 shadow-[0_0_16px_rgba(52,211,153,0.10)]'
                         : 'border-dark-600'}`}
         style={{ background: 'rgb(var(--surface-900))' }}
    >
      {frameSrc ? (
        <>
          <img ref={imgRef} alt="live feed" className="w-full h-full object-contain" />

          {/* Scan line */}
          <div className="scan-line" />

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/20 rounded-tl-sm" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/20 rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/20 rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/20 rounded-br-sm" />

          {/* LIVE badge — top left */}
          <div className="absolute top-3 left-10 flex items-center gap-1.5 px-2.5 py-1
                          rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[10px] font-black tracking-[0.12em] uppercase text-white/80">Live</span>
          </div>

          {/* Status badge — top right */}
          <div className={`absolute top-3 right-10 flex items-center gap-1.5 px-3 py-1
                           rounded-full backdrop-blur-sm border text-[11px] font-black
                           tracking-[0.08em] uppercase transition-all duration-300
                           ${isUnsafe
                             ? 'bg-red-600/80 border-red-400/50 text-white animate-pulse'
                             : 'bg-emerald-600/70 border-emerald-400/40 text-white'}`}>
            {isUnsafe
              ? <ShieldAlert className="w-3.5 h-3.5" />
              : <ShieldCheck className="w-3.5 h-3.5" />}
            {isUnsafe ? 'Unsafe' : 'Safe'}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {/* Grid overlay */}
          <div className="hero-grid absolute inset-0 opacity-30" />

          {/* Decorative corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-dark-500 rounded-tl" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-dark-500 rounded-tr" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-dark-500 rounded-bl" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-dark-500 rounded-br" />

          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            <div className="h-16 w-16 rounded-2xl bg-dark-700 border border-dark-500
                            flex items-center justify-center
                            shadow-[0_0_24px_rgba(139,92,246,0.12)]">
              <Video className="w-7 h-7 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-[14px] mb-1">No active video source</p>
              <p className="text-gray-600 text-[12px]">
                Upload a video, start webcam, or connect an RTSP stream below
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
