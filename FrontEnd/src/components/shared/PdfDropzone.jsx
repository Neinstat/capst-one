import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { validatePdf, formatFileSize } from '../../lib/utils'

export default function PdfDropzone({
  onFile,
  maxMb = 10,
  label = 'Upload Transkrip PDF',
  hint = 'Drag & drop file PDF atau klik untuk memilih',
  disabled = false,
}) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback(
    (accepted) => {
      const f = accepted[0]
      if (!f) return
      const { valid, error: err } = validatePdf(f, maxMb)
      if (!valid) {
        setError(err)
        setFile(null)
        onFile?.(null)
        return
      }
      setError(null)
      setFile(f)
      onFile?.(f)
    },
    [maxMb, onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled,
  })

  function handleRemove(e) {
    e.stopPropagation()
    setFile(null)
    setError(null)
    onFile?.(null)
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-blue-500/50 bg-blue-500/5'
              : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/60'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <UploadIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{hint}</p>
              <p className="text-xs text-slate-600 mt-0.5">Maksimal {maxMb}MB • Format PDF</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <PdfIcon className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckIcon className="w-3.5 h-3.5" />
              Valid
            </span>
            <button
              onClick={handleRemove}
              className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
          <AlertIcon className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

// ── Processing state component ─────────────────────────────────────────────────
export function ProcessingState({ steps, currentStep = 0 }) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, idx) => {
        const done = idx < currentStep
        const active = idx === currentStep
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold
                ${done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}
              `}
            >
              {done ? <CheckIcon className="w-3.5 h-3.5" /> : idx + 1}
            </div>
            <span className={`text-sm ${active ? 'text-slate-200 font-semibold' : done ? 'text-slate-500' : 'text-slate-600'}`}>
              {step}
            </span>
            {active && (
              <div className="flex gap-1 ml-auto">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── File validity banner ───────────────────────────────────────────────────────
export function FileValidityBanner({ type = 'error', message }) {
  const styles = {
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }
  return (
    <div className={`flex items-start gap-3 px-4 py-3 border rounded-lg ${styles[type]}`}>
      <AlertIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function UploadIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  )
}
function PdfIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
function AlertIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  )
}