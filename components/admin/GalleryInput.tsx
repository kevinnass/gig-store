'use client'

import { useState, useRef } from 'react'
import { ImagePlus, Link as LinkIcon, Upload, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface GalleryInputProps {
  value: string[]
  onChange: (urls: string[]) => void
  onFilesSelect?: (files: { index: number; file: File }[]) => void
}

export function GalleryInput({ value, onChange, onFilesSelect }: GalleryInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFiles, setPendingFiles] = useState<{ index: number; file: File }[]>([])

  function addUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    const next = [...value, trimmed]
    onChange(next)
    setUrlInput('')
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const fileArr = Array.from(files)
    const startIndex = value.length
    const newPreviews = fileArr.map((file, i) => `FILE:${startIndex + i}:${file.name}`)
    const newFiles = fileArr.map((file, i) => ({ index: startIndex + i, file }))
    const updated = [...pendingFiles, ...newFiles]
    setPendingFiles(updated)
    onFilesSelect?.(updated)
    onChange([...value, ...newPreviews])
  }

  function removeImage(idx: number) {
    const removed = value[idx]
    const next = value.filter((_, i) => i !== idx)
    onChange(next)
    if (removed.startsWith('FILE:')) {
      const updated = pendingFiles.filter((f) => !removed.includes(`:${f.index}:`))
      setPendingFiles(updated)
      onFilesSelect?.(updated)
    }
  }

  function getPreview(url: string): string | null {
    if (url.startsWith('FILE:')) {
      // Extract index from "FILE:N:filename"
      const parts = url.split(':')
      const idx = parseInt(parts[1])
      const file = pendingFiles.find((f) => f.index === idx)?.file
      if (file) return URL.createObjectURL(file)
      return null
    }
    return url
  }

  return (
    <div className="space-y-4">
      {/* Already added images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url, idx) => {
            const preview = getPreview(url)
            return (
              <div
                key={idx}
                className="relative group aspect-square rounded-lg border bg-muted overflow-hidden"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                )}
                {/* Order badge */}
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold rounded px-1.5 py-0.5">
                  {idx + 1}
                </span>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold rounded px-1.5 py-0.5">
                    Principale
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toggle URL / Upload */}
      <div className="flex rounded-lg border overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
            mode === 'url'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted'
          )}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
            mode === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted'
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="https://images.unsplash.com/..."
          />
          <Button type="button" variant="outline" onClick={addUrl} disabled={!urlInput.trim()}>
            Ajouter
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        >
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Glissez des images ici</p>
            <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB par image)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          La première image est l&apos;image principale du produit.
        </p>
      )}
    </div>
  )
}
