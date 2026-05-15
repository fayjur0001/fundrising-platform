// src/components/campaign/LiveStats.tsx
'use client'

import React, { useState } from 'react'
import { formatBDT } from '@/lib/utils'
import { RefreshCw, TrendingUp, Users } from 'lucide-react'

export default function LiveStats() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats] = useState({ donorsToday: 23, raisedToday: 45000 })

  async function handleRefresh() {
    setIsRefreshing(true)
    await new Promise((res) => setTimeout(res, 800))
    setIsRefreshing(false)
  }

  return (
    <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Live Today</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Users size={14} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">{stats.donorsToday}</p>
            <p className="text-xs text-slate-500">donors today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={14} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">{formatBDT(stats.raisedToday)}</p>
            <p className="text-xs text-slate-500">raised today</p>
          </div>
        </div>
      </div>
    </div>
  )
}