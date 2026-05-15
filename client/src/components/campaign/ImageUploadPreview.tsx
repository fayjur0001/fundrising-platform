// src/components/campaign/ImageUploadPreview.tsx
'use client'

import React, { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
]

interface ImageUploadPreviewProps {
  images?: string[]
  onChange?: (images: string[]) => void
}

export default function ImageUploadPreview({
  images: propImages,
  onChange,
}: ImageUploadPreviewProps) {
  const [images, setImages] = useState<string[]>(propImages ?? MOCK_IMAGES)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onChange?.(updated)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    // Mock: in real app would read files
    console.log('Files dropped:', e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors
          ${isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}
        `}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Upload size={22} className="text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Drag & drop images here</p>
          <p className="text-xs text-slate-400 mt-0.5">or click to upload</p>
        </div>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={src} alt={`Upload preview ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}