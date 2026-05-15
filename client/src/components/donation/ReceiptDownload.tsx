// src/components/donation/ReceiptDownload.tsx
'use client'

import { useState } from 'react'
import type { Donation } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ReceiptDownloadProps {
  donation: Donation
}

export default function ReceiptDownload({ donation }: ReceiptDownloadProps) {
  const [toastVisible, setToastVisible] = useState(false)

  const handleDownload = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  return (
    <div className="relative">
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 text-xs border-gray-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 rounded-lg"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download Receipt
      </Button>

      {toastVisible && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Receipt downloaded for {formatBDT(donation.amount)}
        </div>
      )}
    </div>
  )
}