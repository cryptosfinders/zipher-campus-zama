'use client'

import { Loader2, UploadCloud } from 'lucide-react'
import {
  type DragEvent,
  type KeyboardEvent,
  ReactNode,
  useCallback,
  useRef,
  useState
} from 'react'

import { cn } from '@/lib/utils'

/* ------------------------------ Zipher Theme ------------------------------ */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BG = 'rgba(247, 201, 72, 0.10)'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.35)'
const ZIPHER_GOLD_HOVER_BG = 'rgba(247, 201, 72, 0.18)'
const ZIPHER_GOLD_ACTIVE_BG = 'rgba(247, 201, 72, 0.25)'

/* ------------------------------ File Matcher ------------------------------ */

type MediaDropzoneProps = {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  uploading?: boolean
  helperText?: string
  children?: ReactNode
  className?: string
  dropAreaClassName?: string
  onSelect: (files: File[]) => void
}

function fileMatchesAccept(file: File, accept?: string) {
  if (!accept) return true

  const patterns = accept
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)

  if (patterns.length === 0) return true

  const mime = file.type
  const name = file.name.toLowerCase()

  return patterns.some(pattern => {
    if (pattern === '*/*') return true
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -1)
      return mime.startsWith(base)
    }
    if (pattern.startsWith('.')) {
      return name.endsWith(pattern.toLowerCase())
    }
    return mime === pattern
  })
}

/* ------------------------------ Dropzone ------------------------------ */

export function MediaDropzone({
  accept,
  multiple,
  disabled,
  uploading,
  helperText,
  children,
  className,
  dropAreaClassName = 'min-h-[160px] p-6',
  onSelect
}: MediaDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const resetDrag = useCallback(() => setIsDragActive(false), [])

  const handleFileSelection = useCallback(
    (files: FileList | File[]) => {
      if (disabled || uploading) return
      const fileArray = Array.from(files).filter(file => fileMatchesAccept(file, accept))
      if (fileArray.length === 0) return

      const selected = multiple ? fileArray : fileArray.slice(0, 1)
      if (selected.length === 0) return

      onSelect(selected)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [accept, disabled, multiple, onSelect, uploading]
  )

  const openFileDialog = useCallback(() => {
    if (disabled || uploading) return
    inputRef.current?.click()
  }, [disabled, uploading])

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (disabled || uploading) return
      event.dataTransfer.dropEffect = 'copy'
      setIsDragActive(true)
    },
    [disabled, uploading]
  )

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      resetDrag()
    },
    [resetDrag]
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (disabled || uploading) {
        resetDrag()
        return
      }

      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        handleFileSelection(files)
      }
      resetDrag()
    },
    [disabled, handleFileSelection, resetDrag, uploading]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openFileDialog()
      }
    },
    [openFileDialog]
  )

  /* ----------------------- Default Content (Zipher) ----------------------- */

  const renderDefaultContent = () => (
    <div className="flex flex-col items-center gap-2 px-6 text-center text-sm text-neutral-600">
      <UploadCloud className="h-7 w-7" style={{ color: ZIPHER_GOLD }} />
      <span className="font-medium text-black">Upload media</span>
      <span className="text-xs text-neutral-500">
        Drag & drop or click to browse
      </span>
      {helperText && (
        <p className="text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  )

  /* ------------------------------- Render ------------------------------- */

  return (
    <div className={cn('relative w-full', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || uploading}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          `
          relative flex w-full flex-col items-center justify-center rounded-xl
          border border-dashed transition-all select-none
          bg-gradient-to-br from-white/70 to-white/30
          backdrop-blur-sm shadow-sm
          `,
          dropAreaClassName,

          /* Base Zipher styling */
          disabled || uploading
            ? 'cursor-not-allowed opacity-70'
            : 'cursor-pointer',

            /* Normal border */
          `border-[1.5px] border-[${ZIPHER_GOLD_BORDER}]`,          

          /* Hover state */
          !disabled &&
            !uploading &&
            !isDragActive &&
            `hover:bg-[${ZIPHER_GOLD_BG}] hover:border-[${ZIPHER_GOLD}]`,

          /* Drag active gold glow */
          isDragActive &&
            `
            border-[2px] 
            bg-[${ZIPHER_GOLD_ACTIVE_BG}] 
            border-[${ZIPHER_GOLD}] 
            shadow-[0_0_0_3px_rgba(247,201,72,0.3)]
            text-black
            `
        )}
      >
        {children ?? renderDefaultContent()}

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl"
               style={{ background: 'rgba(255,255,255,0.65)' }}>
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: ZIPHER_GOLD }}
            />
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={event => {
          if (event.target.files) {
            handleFileSelection(event.target.files)
          }
        }}
      />
    </div>
  )
}
