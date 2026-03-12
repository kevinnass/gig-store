'use client'

import { useState, useRef, useEffect } from 'react'
import { ImagePlus, Link as LinkIcon, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ImageInputProps {
  value: string
  onChange: (url: string) => void
  onFileSelect?: (file: File) => void
}

export function ImageInput({ value, onChange, onFileSelect }: ImageInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [preview, setPreview] = useState<string>(value || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Synchroniser l'aperçu si la valeur change de l'extérieur (ex: reset du formulaire)
  useEffect(() => {
    if (!value) {
      setPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else if (!value.startsWith('FILE:')) {
      setPreview(value)
    }
  }, [value])

  function handleUrlChange(url: string) {
    onChange(url)
    setPreview(url)
  }

  function handleFileChange(file: File | null) {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    onFileSelect?.(file)
    // Pour l'instant on met une URL temporaire dans le champ texte
    // L'upload vers Supabase Storage sera géré par le parent
    onChange(`FILE:${file.name}`)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      handleFileChange(file)
    }
  }

  function clearImage() {
    onChange('')
    setPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
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
            value={value.startsWith('FILE:') ? '' : value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
          {value && !value.startsWith('FILE:') && (
            <Button type="button" variant="ghost" size="icon" onClick={clearImage}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Glissez une image ici</p>
            <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {/* Aperçu de l'image */}
      {preview && (
        <div className="relative w-full aspect-video max-w-xs rounded-lg overflow-hidden border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-full object-cover"
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
