import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function VideoUpload({ onStart }) {
  const [state, setState] = useState('idle') // idle | uploading | processing | error
  const [filename, setFilename] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()

  const upload = async (file) => {
    if (!file) return
    setState('uploading')
    setFilename(file.name)

    const form = new FormData()
    form.append('video', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setState('processing')
        onStart?.('upload')
      } else {
        setState('error')
        setFilename(data.error || 'Upload failed')
      }
    } catch {
      setState('error')
      setFilename('Network error')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const onPick = (e) => {
    const file = e.target.files[0]
    if (file) upload(file)
  }

  const icons = {
    idle:       <UploadCloud className="w-8 h-8 text-gray-500" />,
    uploading:  <Loader className="w-8 h-8 text-blue-400 animate-spin" />,
    processing: <CheckCircle className="w-8 h-8 text-green-400" />,
    error:      <XCircle className="w-8 h-8 text-red-400" />,
  }

  return (
    <div
      onClick={() => state === 'idle' && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2
                  border-dashed cursor-pointer transition-all duration-200 select-none
                  ${drag ? 'border-blue-500 bg-blue-900/10' : 'border-dark-500 hover:border-dark-400 bg-dark-700/30'}`}
    >
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={onPick} />
      {icons[state]}
      <div className="text-center">
        {state === 'idle' && (
          <>
            <p className="text-sm font-medium text-gray-300">Drop video or click to upload</p>
            <p className="text-xs text-gray-600 mt-1">MP4, AVI, MOV, MKV, WEBM</p>
          </>
        )}
        {state === 'uploading' && <p className="text-sm text-blue-300">Uploading {filename}…</p>}
        {state === 'processing' && (
          <>
            <p className="text-sm text-green-300 font-medium">Processing {filename}</p>
            <p className="text-xs text-gray-500 mt-1">Annotated frames will appear in the player</p>
          </>
        )}
        {state === 'error' && (
          <>
            <p className="text-sm text-red-400">{filename}</p>
            <button onClick={(e) => { e.stopPropagation(); setState('idle') }}
                    className="text-xs text-gray-500 hover:text-gray-300 mt-1 underline">
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
