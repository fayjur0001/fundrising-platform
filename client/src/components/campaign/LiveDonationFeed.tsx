// src/components/campaign/LiveDonationFeed.tsx
'use client'

import React from 'react'
import { mockDonations } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { Heart } from 'lucide-react'

const MOCK_TIMES = ['2 mins ago', '5 mins ago', '11 mins ago', '18 mins ago', '34 mins ago']

export default function LiveDonationFeed() {
  const recentDonations = mockDonations.slice(0, 5)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-sm font-semibold text-slate-900">Recent Supporters</h3>
      </div>

      <div className="flex flex-col gap-3 overflow-hidden max-h-64">
        {recentDonations.map((donation, i) => (
          <div
            key={donation.id}
            className="flex items-center justify-between gap-3 animate-fade-in"
          >
            {/* Donor avatar */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Heart size={13} className="text-emerald-600 fill-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                </p>
                <p className="text-xs text-slate-400">{MOCK_TIMES[i]}</p>
              </div>
            </div>
            {/* Amount */}
            <span className="text-sm font-semibold text-emerald-600 flex-shrink-0">
              {formatBDT(donation.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}