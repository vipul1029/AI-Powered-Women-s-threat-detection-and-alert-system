import { useEffect, useState } from 'react'
import { FolderOpen, Play, RefreshCw } from 'lucide-react'

export default function InputFolderPicker({ onStart }) {
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState('')
  const [customPath, setCustomPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/input/files')
      const data = await res.json()
      setFiles(data.files || [])
    } catch {
      setFiles([])
    }
  }

  useEffect(() => { fetchFiles() }, [])

  const play = async () => {
    const path = customPath.trim() || selected
    if (!path) { setError('Select a file or enter a path'); return }

    setError('')
    setLoading(true)
    setStatus('')

    try {
      const res = await fetch('/api/stream/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Streaming: ${path}`)
        onStart?.('file')
      } else {
        setError(data.error || 'Failed to start')
      }
    } catch {
      setError('Network error — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Input folder file list */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Files in input/ folder
          </label>
          <button onClick={fetchFiles}
                  className="text-gray-600 hover:text-gray-300 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {files.length === 0 ? (
          <p className="text-xs text-gray-600 italic py-2">
            No videos found — drop files into <code className="text-gray-500">backend/input/</code>
          </p>
        ) : (
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {files.map(f => (
              <button
                key={f}
                onClick={() => { setSelected(f); setCustomPath('') }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate
                            transition-colors border
                            ${selected === f && !customPath
                              ? 'bg-blue-900/40 border-blue-700 text-blue-200'
                              : 'bg-dark-700 border-dark-500 text-gray-300 hover:border-dark-400'}`}
              >
                <FolderOpen className="inline w-3 h-3 mr-1.5 opacity-60" />
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Or enter custom path */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Or enter full path
        </label>
        <input
          type="text"
          value={customPath}
          onChange={e => { setCustomPath(e.target.value); setSelected('') }}
          placeholder="C:\Videos\myvideo.mp4"
          className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5
                     text-xs text-gray-200 placeholder-gray-600 focus:outline-none
                     focus:border-blue-600"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded border border-red-800">
          {error}
        </p>
      )}
      {status && (
        <p className="text-xs text-green-400 bg-green-900/20 px-3 py-2 rounded border border-green-800 truncate">
          {status}
        </p>
      )}

      <button
        onClick={play}
        disabled={loading || (!selected && !customPath.trim())}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                   bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed
                   text-white font-medium text-sm transition-colors"
      >
        <Play className="w-4 h-4" />
        {loading ? 'Starting…' : 'Play Video'}
      </button>

      <p className="text-[11px] text-gray-600 text-center">
        Or launch with: <code className="text-gray-500">python app.py --input myvideo.mp4</code>
      </p>
    </div>
  )
}
