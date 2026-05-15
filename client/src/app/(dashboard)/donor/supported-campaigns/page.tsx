// src/app/(dashboard)/donor/supported-campaigns/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ProgressBar from '@/components/campaign/ProgressBar'
import { mockDonations, mockCampaigns } from '@/lib/mockData'
import type { Campaign } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'

const DONOR_ID = 'user-004'

type StatusFilter = 'all' | 'active' | 'completed'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700',
}

const gradients = [
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
  'from-rose-400 to-pink-500',
]

export default function DonorSupportedCampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const myDonations = mockDonations.filter((d) => d.donorId === DONOR_ID)

  const donationTotalByCampaign = myDonations.reduce<Record<string, number>>((acc, d) => {
    if (d.status === 'completed') {
      acc[d.campaignId] = (acc[d.campaignId] ?? 0) + d.amount
    }
    return acc
  }, {})

  const uniqueCampaignIds = new Set(myDonations.map((d) => d.campaignId))
  const supportedCampaigns = mockCampaigns.filter((c) => uniqueCampaignIds.has(c.id))

  const filtered: Campaign[] =
    statusFilter === 'all'
      ? supportedCampaigns
      : supportedCampaigns.filter((c) => c.status === statusFilter)

  const tabCounts: Record<StatusFilter, number> = {
    all: supportedCampaigns.length,
    active: supportedCampaigns.filter((c) => c.status === 'active').length,
    completed: supportedCampaigns.filter((c) => c.status === 'completed').length,
  }

  return (
    <DashboardLayout role="donor">
      <PageHeader title="Supported Campaigns" />

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${statusFilter === tab.value ? 'text-emerald-600' : 'text-slate-400'}`}>
              {tabCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description={
            statusFilter === 'all'
              ? "You haven't supported any campaigns yet."
              : `No ${statusFilter} campaigns in your supported list.`
          }
          action={
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Browse Campaigns
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, idx) => {
            const pct = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100))
            const myTotal = donationTotalByCampaign[c.id] ?? 0
            const gradient = gradients[idx % gradients.length]

            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="relative">
                  {c.images?.[0] ? (
                    <img
                      src={c.images[0]}
                      alt={c.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className={`w-full h-40 bg-gradient-to-br ${gradient}`} />
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                  {/* Your donation badge */}
                  {myTotal > 0 && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                      Your donation: {formatBDT(myTotal)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-slate-400 mb-1">{c.category}</p>
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-3 flex-1">
                    {c.title}
                  </h3>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium text-emerald-600">{formatBDT(c.raisedAmount)}</span>
                      <span>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>of {formatBDT(c.goalAmount)}</span>
                      <span>{c.donorCount} donors</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-slate-400">
                      Ends {new Date(c.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Link
                      href={`/campaigns/${c.id}`}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}