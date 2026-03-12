'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { ImageOff } from 'lucide-react'

interface SafeImageProps extends ImageProps {
  fallbackClassName?: string
}

export function SafeImage({ src, alt, className, fallbackClassName, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setError(false)
  }, [src])

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 absolute inset-0 text-slate-300 dark:text-slate-700 ${fallbackClassName || ''}`}>
        <div className="relative">
          <ImageOff className="w-8 h-8 opacity-20" />
          <div className="absolute -inset-4 bg-gradient-to-tr from-slate-200/20 to-transparent dark:from-slate-800/20 rounded-full blur-2xl" />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] mt-3 opacity-30">Image non disponible</span>
      </div>
    )
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
