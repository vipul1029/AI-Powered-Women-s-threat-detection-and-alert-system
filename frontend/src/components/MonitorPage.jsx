import { useState } from 'react'
import { UploadCloud, Camera, Radio, FolderOpen, Activity, Shield, Eye, Cpu } from 'lucide-react'
import VideoCanvas from './VideoCanvas'
import VideoUpload from './VideoUpload'
import WebcamFeed from './WebcamFeed'
import RTSPFeed from './RTSPFeed'
import InputFolderPicker from './InputFolderPicker'
import DetectionList from './DetectionList'

const TABS = [
  { key: 'input',  label: 'Input Folder', icon: FolderOpen  },
  { key: 'upload', label: 'Upload Video',  icon: UploadCloud },
  { key: 'webcam', label: 'Webcam',        icon: Camera      },
  { key: 'rtsp',   label: 'RTSP Stream',   icon: Radio       },
]

export default function MonitorPage({ frame, status, detections, streamEnded }) {
  const [sourceTab, setSourceTab] = useState('input')

  const isUnsafe  = status === 'UNSAFE'
  const threats   = detections?.filter(d => d.class !== 'none').length ?? 0
  const totalDets = detections?.length ?? 0

  return (
    <div className="flex gap-5 h-full">

      {/* ── Left: video + source controls ──────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Video player */}
        <VideoCanvas frameSrc={frame} status={status} />

        {/* Stream ended banner */}
        {streamEnded && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                          bg-amber-500/[0.07] border border-amber-500/25 text-amber-300 text-[12px] font-medium">
            <Radio className="w-4 h-4 shrink-0" />
            Stream ended — upload another video or reconnect a source below.
          </div>
        )}

        {/* Source selector card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 space-y-4">

          {/* Tab row */}
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSourceTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11.5px]
                            font-bold transition-all duration-200
                            ${sourceTab === key
                              ? 'bg-gradient-to-r from-violet-600/30 to-blue-600/20 text-white border border-violet-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'
                              : 'text-gray-500 hover:text-gray-200 hover:bg-dark-700 border border-transparent'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Source content */}
          <div className="border-t border-dark-600 pt-4">
            {sourceTab === 'input'  && <InputFolderPicker onStart={() => {}} />}
            {sourceTab === 'upload' && <VideoUpload onStart={() => {}} />}
            {sourceTab === 'webcam' && <WebcamFeed onStart={() => {}} onStop={() => {}} />}
            {sourceTab === 'rtsp'   && <RTSPFeed   onStart={() => {}} onStop={() => {}} />}
          </div>
        </div>
      </div>

      {/* ── Right sidebar ───────────────────────────────────────────────── */}
      <div className="w-72 shrink-0 flex flex-col gap-4">

        {/* System status card */}
        <div className={`rounded-2xl border p-4 transition-all duration-300
                         ${isUnsafe
                           ? 'bg-red-500/[0.06] border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.12)]'
                           : 'bg-dark-800 border-dark-600'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center
                             ${isUnsafe ? 'bg-red-500/20' : 'bg-emerald-500/15'}`}>
              <Shield className={`w-4 h-4 ${isUnsafe ? 'text-red-400' : 'text-emerald-400'}`} />
            </div>
            <div>
              <div className="text-gray-100 font-black text-[13px]">System Status</div>
              <div className={`text-[11px] font-bold ${isUnsafe ? 'text-red-400' : 'text-emerald-400'}`}>
                {status || 'Standby'}
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-center">
              <div className="text-gray-100 font-black text-[18px] leading-none mb-0.5">
                {totalDets}
              </div>
              <div className="text-gray-500 text-[9.5px] font-bold tracking-[0.07em] uppercase">
                Objects
              </div>
            </div>
            <div className={`rounded-xl px-3 py-2.5 text-center border transition-colors
                             ${threats > 0
                               ? 'bg-red-500/[0.08] border-red-500/25'
                               : 'bg-dark-700 border-dark-600'}`}>
              <div className={`font-black text-[18px] leading-none mb-0.5
                               ${threats > 0 ? 'text-red-400' : 'text-gray-100'}`}>
                {threats}
              </div>
              <div className="text-gray-500 text-[9.5px] font-bold tracking-[0.07em] uppercase">
                Threats
              </div>
            </div>
          </div>
        </div>

        {/* Live detections card */}
        <div className="flex-1 bg-dark-800 border border-dark-600 rounded-2xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20
                            flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <h3 className="text-gray-100 font-black text-[13px]">Live Detections</h3>
            {totalDets > 0 && (
              <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full
                               bg-violet-500/15 border border-violet-500/25 text-violet-300">
                {totalDets}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto pr-0.5">
            <DetectionList detections={detections} />
          </div>
        </div>

        {/* AI Engine card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-gray-400 text-[11px] font-bold tracking-[0.06em] uppercase">AI Engine</span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Model',     value: 'YOLOv8n'   },
              { label: 'Backend',   value: 'PyTorch'   },
              { label: 'Inference', value: '< 50 ms'   },
              { label: 'Classes',   value: '7 threats' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-600 text-[11px]">{label}</span>
                <span className="text-gray-300 text-[11px] font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
